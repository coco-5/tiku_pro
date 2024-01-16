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
                :current="current"
                :answerDataObj="answerDataObj"
                @answer="answer"
                @change="change"
            >
            </practise-swiper>
        </view>

        <practise-footer
            :options="options"
            :list="questionList"
            :current="current"
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
import { getDetailByPaperIdApi, getQuestionByPaperIdApi, startApi, endApi } from '@/utils/api'
import PractiseFooter from '../../components/practise-footer.vue'
import practiseSwiper from '../../components/practise-swiper.vue'
import useTime from '../../components/use-time.vue'
export default {
  components: { practiseSwiper, PractiseFooter, useTime },
    data(){
        return {
            options:'',
            current:0,//当前做题的索引 
            questionList:[],//题目列表
            contentStyle:'',
            answerDataObj:{},//答题数据
            ansCardList:[],
            useTime:'00:00:00',
            paperDetail:''
        }
    },
    onLoad(e){
        // type 1做题 2解析 3查看，没有解析
        // mode 1题海 2章节 3历年真题 4模拟考试
        // state 1练习 2考试

        this.options = e

        this.startTime = utils.timeStamp()

        this.current = this.options.current || 0

        if(this.options.type == 1){
            this.startPaper().then(()=>{
                this.getList()
            })
        }else if(this.options.type == 2){
            this.getList()
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
                        resolve()
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
                this.initDetail(data[0])
                this.initPaper(data[1])
                uni.hideLoading()
            })
        },
        getDetail(){
            let params = {
                paperId:this.options.paperId
            }

            return new Promise((resolve)=>{
                getDetailByPaperIdApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                        this.paperDetail = data
                        resolve(data)
                    }
                })
            })
        },
        getPaper(){
            let params = {
                paperId:this.options.paperId
            }
        
            return new Promise((resolve)=>{
                getQuestionByPaperIdApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).questionList
                        resolve(data)
                    }
                })    
            })
        },
        initDetail(data){
            let groupList = data.questionGroupList
            let ansCardList = []
            let count = 1

            groupList.forEach((item)=>{
                let list = {}
                let sort = []

                list.groupName = item.name
                item.questionIds && item.questionIds.length > 0 && item.questionIds.forEach((qItem,qIndex)=>{
                    sort.push({
                        index:count,
                        id:qItem
                    })
                    count++
                })
                list.sort = sort
                ansCardList.push(list)  
            })

            this.ansCardList = ansCardList
        },
        initPaper(data){
            let answerDataObj = {}

            data.forEach((item,index)=>{
                item.showContent = utils.replaceHTMLChar(item.content)
                if(item.quType != 4){
                    item.questionDetailList && item.questionDetailList.length > 0 && item.questionDetailList.forEach((itemDetail,indexDetail)=>{
                        itemDetail.showContent = utils.replaceHTMLChar(itemDetail.content) 

                        itemDetail.answerList.length > 0 && itemDetail.answerList.forEach((itemAnswer)=>{
                            itemAnswer.showContent = utils.replaceHTMLChar(itemAnswer.content) 
                        })
                        
                        answerDataObj[itemDetail.id] = {
                            questionId:itemDetail.id,
                            seq:[],//选项
                            answer:''//简答
                        } 
                    })
                }
            })

            this.questionList = data
            this.answerDataObj = answerDataObj 
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
        change(index){
            this.current = index
        },
        answer(answerDataObj){
            this.answerDataObj = answerDataObj
        },
        submit(){
            let answerList = []
            let answerDataObj = this.answerDataObj || {}

			for(let k in answerDataObj){
                answerList.push(answerDataObj[k])
            }

            let param = {
                startTime : this.startTime,
                endTime : utils.timeStamp(),
                answerList : answerList,
                type : this.options.state,
                saveFlag : 2//1暂存2提交成绩
            }

            if(this.options.state == 1){
                param.practiceId = this.options.practiceId
            }else if(this.options.state == 2){
                param.paperId = this.options.paperId
            }

            endApi(param).then((res)=>{
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
            }

            uni.redirectTo({
                url : `/packagePractise/pages/report/report?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>