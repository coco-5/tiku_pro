<template>
    <view class="page-practise">
        <c-navigation-bar
            title="历年真题"
            backType="1"
            @cbNavigationHeight="cbNavigationHeight"
        >
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
import { getQuestionByPaperIdApi, startApi, endApi } from '@/utils/api'
import PractiseFooter from '../../components/practise-footer.vue'
import practiseSwiper from '../../components/practise-swiper.vue'
export default {
  components: { practiseSwiper, PractiseFooter },
    data(){
        return {
            options:'',
            current:0,//当前做题的索引 
            questionList:[],//题目列表
            contentStyle:'',
            answerDataObj:{},//答题数据
            ansCardList:[],
        }
    },
    onLoad(e){
        //mode 1 历年真题 2 模拟考试
        //state 1 练习模式 2 考试模式

        this.options = e

        this.startTime = utils.timeStamp()



        this.ansCardList = [
            {
                groupName:'1111',
                sort:[
                    {index:1,type:0},
                    {index:2,type:1},
                    {index:3,type:2},
                    {index:4,type:3},
                    {index:5,type:0}
                ]
            },
            {
                groupName:'2222',
                sort:[
                    {index:1,type:0},
                    {index:2,type:1},
                    {index:3,type:2},
                    {index:4,type:3},
                    {index:5,type:0}
                ]
            }
        ]
    },
    onShow(){
        this.startPaper()
        this.getPaper()
    },
    methods:{
        startPaper(){
            let params = {
                paperId:this.options.paperId,
                type:this.options.state 
            }

            startApi(params).then((res)=>{

            })
        },
        getPaper(){
            let params = {
                paperId:this.options.paperId
            }
        
            getQuestionByPaperIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).questionList
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
                    console.log(9999,'questionList',this.questionList)
                    this.answerDataObj = answerDataObj 
                }
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

            console.log(999,'answerList',answerList    )

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

            console.log(999,'param',param)

            endApi(param).then((res)=>{

            })
        },
        goReport(){
            let params = {
                paperId:this.options.paperId,
                mode:this.options.mode
            }

            uni.redirectTo({
                url : `/packagePractise/pages/report/report?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    }
}
</script>