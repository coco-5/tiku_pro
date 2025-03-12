<template>
    <view class="page-practise">
        <c-navigation-bar
            title="历年真题"
            backType="1"
            @cbNavigationHeight="cbNavigationHeight"
        >
            <template #content>
                <use-time 
                    :options="options"
                    :time="answerTime"
                    v-if="options.type == 1"
                >
                </use-time>
            </template>
        </c-navigation-bar>

        <view 
            class="content"
            :style="contentStyle"
        > 
            <view 
                class="audio"
                v-if="audioShow"
            >
                <caudio
                    :path="audioPath"
                ></caudio>
            </view>

            <view 
                :style="swiperStyle"
            >
                <practise-swiper
                    :options="options"
                    :list="questionList"
                    :index="index"
                    :subIndex="subIndex"
                    :answerDataObj="answerDataObj"
                    @answer="answer"
                    @change="change"
                >
                </practise-swiper>
            </view>
        </view>

        <practise-footer
            :options="options"
            :list="questionList"
            :current="index"
            :subIndex="subIndex"
            :ansCardList="ansCardList"
            @cbFooterHeight="cbFooterHeight"
            @change="change"
            @submit="submit"
            @practise="practise"
        >
        </practise-footer>

        <c-wechat
            v-if="options.type == 2"
        ></c-wechat>
    </view>
</template>
 
<script>
import utils from '@/utils/utils'
import { getPaperDetailApi, getDetailByPaperIdApi, startApi, endApi, getPracticeApi, analysisApi, getQuestionApi } from '@/utils/api'
import PractiseFooter from '../../components/practise-footer.vue'
import practiseSwiper from '../../components/practise-swiper.vue'
import useTime from '../../components/use-time.vue'
import caudio from '../../components/caudio.vue'
export default {
  components: { practiseSwiper, PractiseFooter, useTime, caudio },
    data(){
        return {
            options:'',
            index:0,//当前做题的索引 
            subIndex:0,//小题的索引
            questionList:[],//题目列表
            contentStyle:'',
            answerDataObj:{},//答题数据
            ansCardList:[],//答题卡
            paperDetail:'',
            answerTime:0,
            audioPath:'',
            audioShow:false,
            swiperStyle:0
        }
    },
    onLoad(e){
        // type 1做题 2解析 3单题解析
        // mode 1题海 2章节 3历年真题 4模拟考试
        // state 1练习 2考试

        //如果考试是四六级，答题卡特殊处理

        this.options = e
        this.startTime = utils.timeStamp()
        this.examInfo = uni.getStorageSync('examInfo')//选择考试

        if(this.options.type == 1){
            this.startPaper().then(()=>{
                //练习模式获取上次练习的情况
                if(this.options.state == 1){
                    this.getPractice().then((data)=>{
                        this.getList()    
                    })
                }else{
                //考试模式直接获取试卷数据
                    this.getList()
                }
            })
        }else if(this.options.type == 2){
            //this.index = this.options.topIndex
            //this.subIndex = this.options.subIndex
            this.getAnalysisList()
        }else if(this.options.type == 3){
            this.getQuestion()
        }
    },
    onShow(){
    },
    onHide(){
        this.audioShow = false
    },
    onUnload(){
        this.audioShow = false
    },
    methods:{
        startPaper(){
            let params = {
                paperId:this.options.paperId,
                type:this.options.state 
            }

            return new Promise((resolve, reject)=>{
                startApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                        this.options.practiceId = data.practiceId 
                        resolve()
                    }
                })
            })
        },
        getPractice(){
            let params = {
                practiceId:this.options.practiceId
            }

            return new Promise((resolve)=>{
                getPracticeApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                        resolve(data)
                    }
                })
            })
        },
        getList(){
            let list = [
                this.getDetail(),
                this.getPaper()
            ]

            uni.showLoading()

            Promise.all(list).then((data)=>{
                this.initDetail()
                uni.hideLoading()
            })
        },
        getAnalysisList(){
            let list = [
                this.getAnalysis(),
                this.getPaper()
            ]

            Promise.all(list).then(()=>{
            })
        },
        getAnalysis(){
            let params = {
                practiceId:this.options.practiceId,
                wrongFlag:this.options.wrongFlag || 0
            }

            return new Promise((resolve)=>{
                analysisApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).analysisGroupList
                        this.initAnalysis(data)
                    }
                })
            })
        },
        getPaper(){
            let params = {
                paperId:this.options.paperId    
            }
            return new Promise((resolve, reject)=>{
                getDetailByPaperIdApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                        this.audioPath = data.questionGroupList[1].audioPath
                        this.answerTime = data.answerTime
                        resolve()
                    }
                })
            })
        },
        getDetail(){
            let params = {
                paperId:this.options.paperId
            }

            return new Promise((resolve)=>{
                getPaperDetailApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                        this.paperDetail = data.questionGroupList
                        resolve()
                    }
                })
            })
        },
        initDetail(){
            let groupList = this.paperDetail
            let answerDataObj = {}
            let ansCardList = []//答题卡
            let showIndex = 1
            let topIndex = 0
            let list = []//重新组合的做题数据
            let examId = this.examInfo.id

            groupList.forEach((value,index)=>{
                //重置
                let item = {}
                let sort = []

                value.description = value.description.replace(/\n/g,'<br/><br/>')
                item.name = value.name
                item.description = value.description 

                value.groupIsDesc = 1
                list.push(value)

                value.questionList && value.questionList.length > 0 && value.questionList.forEach((v,i)=>{
                    v.showContent = utils.replaceHTMLChar(v.content)
                    v.showContent = v.showContent.replace(/\n/g,'<br/><br/>')
                    v.showContent = v.showContent.replace(/\<p/g,'<p style="margin-bottom:16px;"')

                    //四六级考试右上角显示需要特殊处理
                    if(examId == 4){
                        if(index == 0){
                            v.isSpecial = 1
                            v.showText = '写作'
                        }else if(index == 3){
                            v.isSpecial = 1
                            v.showText = '翻译'
                        }else{
                            v.isSpecial = 0
                        }
                    }

                    v.questionDetailList && v.questionDetailList.length > 0 && v.questionDetailList.forEach((itemDetail,indexDetail)=>{
                        itemDetail.showContent = utils.replaceHTMLChar(itemDetail.content) 
                        itemDetail.showIndex = showIndex
                        if(itemDetail.quType != 4){
                            itemDetail.answerList && itemDetail.answerList.length > 0 && itemDetail.answerList.forEach((itemAnswer)=>{
                                itemAnswer.showContent = utils.replaceHTMLChar(itemAnswer.content) 
                            })
                        }

                        let text = ''
                        if(examId == 4){
                            if(showIndex == 1){
                                text = '写'
                            }else if(showIndex == 57){
                                text = '译'
                            }else{
                                text = showIndex - 1   
                            }
                        }else{
                            text = showIndex    
                        }
                        itemDetail.showText = text

                        sort.push({
                            id:itemDetail.id,
                            topIndex:topIndex+index+1,
                            subIndex:indexDetail,
                            showIndex:showIndex,
                            showText:text,
                            on:0,
                            answer:0
                        })
                        showIndex++

                        answerDataObj[itemDetail.id] = {
                            questionId:itemDetail.id,
                            seq:[],//选项
                            answer:''//简答
                        } 
                    })
                    
                    topIndex++
                    list.push(v)
                })
                
                item.sort = sort
                ansCardList.push(item)
            })

            this.answerDataObj = answerDataObj
            this.ansCardList = ansCardList
            this.questionList = list



            //console.log(999,'ansCardList',this.ansCardList)
            //console.log(999,'questionList',this.questionList)
        },
        initAnalysis(data){
            let analysis = data
            let answerDataObj = {}
            let ansCardList = []//答题卡
            let showIndex = 1
            let topIndex = 0
            let list = []//重新组合的做题数据
            let examId = this.examInfo.id

            analysis.forEach((value,index)=>{
                //重置
                let item = {}
                let sort = []
                item.name = value.name
                item.description = value.description 

                value.groupIsDesc = 1
                //list.push(value)
                
                value.analysisList.forEach((v,i)=>{
                    v.showContent = utils.replaceHTMLChar(v.content)
                    //四六级考试右上角显示需要特殊处理
                    if(examId == 4){
                        if(index == 0){
                            v.isSpecial = 1
                            v.showText = '写作'
                        }else if(index == 3){
                            v.isSpecial = 1
                            v.showText = '翻译'
                        }else{
                            v.isSpecial = 0
                        }
                    }
                    v.analysisDetailList.forEach((itemDetail,indexDetail)=>{
                        itemDetail.showContent = utils.replaceHTMLChar(itemDetail.content)  
                        itemDetail.showIndex = showIndex
                        itemDetail.showAnalysis = utils.replaceHTMLChar(itemDetail.analysis)  
                        itemDetail.id = itemDetail.questionId
                        if(itemDetail.answerSeq){
                            itemDetail.answerOption = itemDetail.answerSeq.join(',')
                        }

                        let rightOption = []

                        if(itemDetail.quType != 4){
                            itemDetail.answerList && itemDetail.answerList.length > 0 && itemDetail.answerList.forEach((itemAnswer)=>{
                                itemAnswer.showContent = utils.replaceHTMLChar(itemAnswer.content) 
                                if(itemAnswer.isRight == 1){
                                    rightOption.push(itemAnswer.seq)
                                }
                            })
                        }
                        itemDetail.rightOption = rightOption.join(',')

                        let text = ''
                        if(examId == 4){
                            if(showIndex == 1){
                                text = '写'
                            }else if(showIndex == 57){
                                text = '译'
                            }else{
                                text = showIndex - 1   
                            }
                        }else{
                            text = showIndex    
                        }
                        itemDetail.showText = text

                        sort.push({
                            id:itemDetail.questionId,
                            topIndex:topIndex,
                            subIndex:indexDetail,
                            showIndex:showIndex,
                            showText:text,
                            on:0,
                            answer:0
                        })

                        answerDataObj[itemDetail.questionId] = {
                            questionId:itemDetail.questionId,
                            seq:[],//选项
                            answer:''//简答
                        } 

                        showIndex++
                    })
                    topIndex++
                    v.questionDetailList = v.analysisDetailList
                    list.push(v)
                })

                item.sort = sort
                ansCardList.push(item)
            })
            this.answerDataObj = answerDataObj
            this.ansCardList = ansCardList
            this.questionList = list
        },
        getQuestion(){
            let params = {
                questionId:this.options.questionId
            }

            return new Promise((resolve)=>{
                getQuestionApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                        resolve()
                    }
                })
            })
        },
        cbFooterHeight(e){
            this.footerHeight = e
            this.matchContentStyle()
        },
        cbNavigationHeight(e){
            this.navigationHeight = e
            this.matchContentStyle()
        },
        matchContentStyle(){
            let height = this.footerHeight + this.navigationHeight + 80

            if(height){
                this.blockHeight = height
                this.contentStyle = `height:calc(100vh - ${height}rpx);`
                this.matchSwiperStyle()
            }
        },
        matchSwiperStyle(){
            let audioHeight = this.audioShow ? 80 : 0
            this.swiperStyle = `height:calc(100vh - ${this.blockHeight}rpx - ${audioHeight}rpx);`
        },
        change(topIndex,subIndex){
            this.index = topIndex
            this.subIndex = subIndex
            this.setAnswerCardOptionOn()
            this.initAudio()
        },
        initAudio(){
            if(this.examInfo.id == 4 && this.audioPath){
                if(this.options.type == 1){
                    if(this.index >= 3 && this.index < 6){
                        this.audioShow = true
                    }else{
                        this.audioShow = false    
                    }
                }else if(this.options.type == 2){
                    if(this.index >= 1 && this.index <= 3){
                        this.audioShow = true
                    }else{
                        this.audioShow = false      
                    }
                }
            }else{
                this.audioShow = false    
            }
            this.matchSwiperStyle()
        },
        answer(answerDataObj,id){
            this.answerDataObj = answerDataObj

            this.setAnswerCardOptionAnswer(id)
        },
        setAnswerCardOptionOn(){
            this.ansCardList.forEach((item)=>{
                item.sort.forEach((i)=>{
                    if(i.topIndex == this.index && i.subIndex == this.subIndex){
                        i.on = 1
                    }else{
                        i.on = 0
                    }
                })
            })
        },
        setAnswerCardOptionAnswer(id){
            let ansCardList = this.ansCardList
            let answerDataObj = this.answerDataObj || {}
            let isAnswer = (answerDataObj[id].answer || answerDataObj[id].seq.length > 0) ? 1 : 0

            for(let i=0;i<ansCardList.length;i++){
                let sort = ansCardList[i].sort
                for(let j=0;j<sort.length;j++){
                    if(sort[j].id == id){
                        sort[j].answer = isAnswer
                        break
                    }
                }
            }
        },
        submit(){
            let answerList = []
            let answerDataObj = this.answerDataObj || {}

			for(let k in answerDataObj){
                answerList.push(answerDataObj[k])
            }

            let params = {
                startTime : this.startTime,
                endTime : utils.timeStamp(),
                answerList : answerList,
                type : this.options.state,
                saveFlag : 2//1暂存2提交成绩
            }

            if(this.options.state == 1){
                params.practiceId = this.options.practiceId
            }else if(this.options.state == 2){
                params.paperId = this.options.paperId
            }

            endApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                    this.endData = data
                    if(this.endData.state != -1){
                        this.goReport()
                    }
                }
            })
        },
        goReport(){
            let params = {
                practiceId:this.endData.practiceId,
                stete:this.endData.type,
                mode:this.options.mode,
                paperId:this.options.paperId
            }

            uni.redirectTo({
                url : `/packagePractise/pages/report/report?${utils.paramsStringify(params)}`
            })
        }
    },
    onShareAppMessage(e){
        let list = this.questionList
        let questionId = 0
        for(let i=0; i<list.length; i++){
            if(i == this.index){
                let item = list[i].questionDetailList
                for(let j=0; j<item.length; j++){
                    if(j == this.subIndex){
                        questionId = item[j].id 
                        break  
                    }
                }
            }
        }
        
        let params = {
            questionId:questionId,
            type:3,
            mode:this.options.mode
        }
        let path = `/packagePractise/pages/practise/practise?${utils.paramsStringify(params)}`

        console.log(999,'path',path)
        return {
            title:'这道难题需要您帮我看一看',
            path:path,
            imageUrl:''
        }
    }
}
</script>

<style lang="scss" scoped>
.audio {
    margin:20rpx 32rpx;
}
</style>