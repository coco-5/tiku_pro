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
                    :time="paperDetail.answerTime"
                >
                </use-time>
            </template>
        </c-navigation-bar>

        <view 
            class="content"
            :style="contentStyle"
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

        <practise-footer
            :options="options"
            :list="questionList"
            :current="index"
            :ansCardList="ansCardList"
            @cbFooterHeight="cbFooterHeight"
            @change="change"
            @submit="submit"
            @practise="practise"
        >
        </practise-footer>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPaperDetailApi, startApi, endApi, getPracticeApi, analysisApi } from '@/utils/api'
import PractiseFooter from '../../components/practise-footer.vue'
import practiseSwiper from '../../components/practise-swiper.vue'
import useTime from '../../components/use-time.vue'
export default {
  components: { practiseSwiper, PractiseFooter, useTime },
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
            questionIds:[],//题目id组
        }
    },
    onLoad(e){
        // type 1做题 2解析 3查看，没有解析
        // mode 1题海 2章节 3历年真题 4模拟考试
        // state 1练习 2考试

        this.options = e

        this.startTime = utils.timeStamp()

        this.index = this.options.index || 0

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
            this.getAnalysis()
        }
    },
    onShow(){
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
                this.getDetail()
            ]

            uni.showLoading()

            Promise.all(list).then((data)=>{
                this.initDetail()
                uni.hideLoading()
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
        getDetail(){
            let params = {
                paperId:this.options.paperId
            }

            return new Promise((resolve)=>{
                getPaperDetailApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                        this.paperDetail = data.questionGroupList
                        console.log(999,'paperDetail',this.paperDetail)
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

            groupList.forEach((value,index)=>{
                //重置
                let item = {}
                let sort = []
                item.name = value.name
                item.description = value.description 

                value.groupIsDesc = 1
                list.push(value)

                value.questionList && value.questionList.length > 0 && value.questionList.forEach((v,i)=>{
                    v.showContent = utils.replaceHTMLChar(v.content)
                    v.questionDetailList && v.questionDetailList.length > 0 && v.questionDetailList.forEach((itemDetail,indexDetail)=>{
                        itemDetail.showContent = utils.replaceHTMLChar(itemDetail.content) 
                        itemDetail.showIndex = showIndex
                        if(itemDetail.quType != 4){
                            itemDetail.answerList && itemDetail.answerList.length > 0 && itemDetail.answerList.forEach((itemAnswer)=>{
                                itemAnswer.showContent = utils.replaceHTMLChar(itemAnswer.content) 
                            })
                        }

                        sort.push({
                            id:itemDetail.id,
                            topIndex:topIndex+index+1,
                            subIndex:indexDetail,
                            showIndex:showIndex,
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

            console.log(999,'groupList',groupList)
        },
        initAnalysis(data){
            let analysis = data
            let answerDataObj = {}
            let ansCardList = []//答题卡
            let showIndex = 1
            let topIndex = 0
            let list = []//重新组合的做题数据
            let questionIds = []

            analysis.forEach((value,index)=>{
                //重置
                let item = {}
                let sort = []
                let ids = []
                item.name = value.name
                item.description = value.description 

                value.groupIsDesc = 1
                list.push(value)
                
                value.analysisList.forEach((v,i)=>{
                    v.showContent = utils.replaceHTMLChar(v.content)
                    v.analysisDetailList.forEach((itemDetail,indexDetail)=>{
                        itemDetail.showContent = utils.replaceHTMLChar(itemDetail.content)  
                        itemDetail.showIndex = showIndex
                        itemDetail.showAnalysis = utils.replaceHTMLChar(itemDetail.analysis)  

                        ids.push(itemDetail.id)

                        if(itemDetail.quType != 4){
                            itemDetail.answerList && itemDetail.answerList.length > 0 && itemDetail.answerList.forEach((itemAnswer)=>{
                                itemAnswer.showContent = utils.replaceHTMLChar(itemAnswer.content) 
                            })
                        }

                        sort.push({
                            id:itemDetail.id,
                            topIndex:topIndex+index+1,
                            subIndex:indexDetail,
                            showIndex:showIndex,
                            on:0,
                            answer:0
                        })

                        answerDataObj[itemDetail.id] = {
                            questionId:itemDetail.id,
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
                questionIds.push(ids)
                ansCardList.push(item)
            })
            this.answerDataObj = answerDataObj
            this.ansCardList = ansCardList
            this.questionList = list
            console.log(999,'questionIds',questionIds)
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
                this.contentStyle = `height:calc(100vh - ${height}rpx);`
            }
        },
        change(topIndex,subIndex){
            this.index = topIndex
            this.subIndex = subIndex
            this.setAnswerCardOptionOn()
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
                    console.log(999,'end',this.endData)
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
            }

            uni.redirectTo({
                url : `/packagePractise/pages/report/report?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    },
    onShareAppMessage(e){
        let params = {
            questionId:0
        }
        let path = `/packagePractise/pages/report/report?${this.$hq.utils.paramsStringify(params)}`
        return {
            title:'这道难题需要您帮我看一看',
            path:path,
            imageUrl:''
        }
    }
}
</script>

<style lang="scss" scoped>
</style>