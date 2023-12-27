<template>
    <view class="page-practise">
        <c-navigation-bar
            title="历年真题"
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
            @cbFooterHeight="cbFooterHeight"
            @change="change"
            @submit="submit"
            @practise="practise"
        >
        </practise-footer>
    </view>
</template>

<script>
import PractiseFooter from '../../components/practise-footer.vue'
import practiseSwiper from '../../components/practise-swiper.vue'
export default {
  components: { practiseSwiper, PractiseFooter },
    data(){
        return {
            options:'',
            current:0,//当前做题的索引 
            questionList:['',''],//题目列表
            contentStyle:'',
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){

    },
    methods:{
        cbFooterHeight(e){
            this.footerHeight = e
            this.matchContentStyle()
        },
        cbNavigationHeight(e){
            this.navigationHeight = e
            this.matchContentStyle()
        },
        matchContentStyle(){
            let height = this.footerHeight + this.navigationHeight

            if(height){
                this.contentStyle = `height:calc(100vh - ${height}rpx);`
            }
        },
        change(index){
            this.current = index
        },
        submit(){

        },
        practise(){
            let params = {

            }
            let url = `/packagePractise/pages/practise/practise?${this.$hq.utils.paramsStringify(params)}`

            uni.redirectTo({
                url
            })
        }
    }
}
</script>