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
import { getQuestionByPaperIdApi } from '@/utils/api'
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
            ansCardList:[],
        }
    },
    onLoad(e){
        //mode 1 历年真题 2 模拟考试
        //type 1 练习模式 2 考试模式

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
        this.getPaper()
    },
    methods:{
        getPaper(){
            let params = {
                paperId:this.options.paperId
            }
        
            getQuestionByPaperIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).questionList

                    data.forEach((item)=>{
                        item.showContent = utils.replaceHTMLChar(item.content)
                    })

                    this.questionList = data
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

            console.log(999,'footerHeight',this.footerHeight)
            console.log(999,'navigationHeight',this.navigationHeight)
            console.log(999,'height',height)

            if(height){
                this.contentStyle = `height:calc(100vh - ${height}rpx);`
            }
        },
        change(index){
            this.current = index
        },
        submit(){
            this.endTime = utils.timeStamp()

            let param = {

            }
        }
    }
}
</script>