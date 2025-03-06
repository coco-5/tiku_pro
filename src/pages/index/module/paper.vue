<template>
    <view class="paper">
        <view class="hd">真题考试<text>刷题 题目大合集</text></view>
        <view class="bd">
            <view class="tab">
                <view 
                    class="item"
                    :class="('item-' + item.type) + (tabIndex == index ? ' on ' : '')"
                    @click="changeTab(index)"
                    v-for="(item,index) in tabList"
                    :key="index"
                >
                    {{tabIndex == index ? '' : item.name}}
                </view>
            </view>
            <view 
                class="list"
                v-if="!loading && paperList.length"
            >
                <c-paper-list
                    :mode="mode"
                    :list="paperList"
                    isMore="true"
                    @showPop="showPop"
                ></c-paper-list>
            </view>

            <template 
                v-if="!loading && paperList.length == 0"
            >
                <c-no-content></c-no-content>
            </template>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPaperBySubjectIdApi } from '@/utils/api'
export default {
    props:{
        options:{
            type:Object
        },
        subjectInfo:{
            type:Object
        }
    },
    watch:{
        subjectInfo:{
            deep:true,
            handler(n){
                if(n){
                    this.tabIndex = 0
                    this.getPaper()
                }
            }
        },
        options:{
            deep:true,
            handler(n){
            }
        }
    },
    data(){
        return {
            mode:0,
            loading:true,
            tabList:[
                {
                    type:'lnzt',
                    name:'历年真题',
                    mode:3,
                    
                }/* ,
                {
                    type:'mnks',
                    name:'模拟考试',
                    mode:4
                } */
            ],
            tabIndex:0,
            paperList:[]
        }
    },
    mounted(){
        this.mode = this.tabList[this.tabIndex].mode
    },
    methods:{
        getPaper(){
            uni.showLoading()

            let params = {
                subjectId:this.subjectInfo.id,
                type:this.tabList[this.tabIndex].type,
                pageSize:3,
                pageNum:1
            }

            //subjectId 6 英语四级
            //subjectId 7 英语六级
            let mock = []

            if(this.subjectInfo.id == 6){
                mock = [
                    {
                        difficulty:3,
                        name:'2024年12月大学英语四级真题',
                        practicingNums:1235,
                        type:'pop'
                    },
                    {
                        difficulty:2,
                        name:'2024年6月大学英语四级真题',
                        practicingNums:2222,
                        type:'pop'
                    }
                ]
            }else if(this.subjectInfo.id == 7){
                mock = [
                    {
                        difficulty:3,
                        name:'2024年12月大学英语六级真题',
                        practicingNums:1235,
                        type:'pop'
                    },
                    {
                        difficulty:2,
                        name:'2024年6月大学英语六级真题',
                        practicingNums:2222,
                        type:'pop'
                    }
                ]
            }
        
            getPaperBySubjectIdApi(params).then((res)=>{
                this.loading = false
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).paperDTOList

                    mock = mock.concat(data)

                    this.paperList = mock

                    uni.hideLoading()
                }
            })  

        },
        changeTab(index){
            if(this.tabIndex == index) return

            this.tabIndex = index
            this.mode = this.tabList[this.tabIndex].mode

            this.getPaper()
        },
        showPop(){
            this.$emit('showPop')
        }
    }
}
</script>

<style lang="scss" scoped>
.paper {
    padding:32rpx;
    background:linear-gradient(180deg, #FFF 0%, #F6F6F6 100%);
    .hd {
        height:76rpx;
        line-height:76rpx;
        color:#010B16;
        font-size:32rpx;
        font-weight:500;
        text {
            display:inline-block;
            margin-left:24rpx;
            color:#ADB1B5;
            font-size:24rpx;
            vertical-align:middle;
        }
    }
    .tab {
        margin-bottom:24rpx;
        height:72rpx;
        .item {
            box-sizing:border-box;
            display:inline-block;
            margin-right:32rpx;
            width:178rpx;
            height:64rpx;
            line-height:64rpx;
            background:#F1F1F1;
            border-radius:8rpx;
            border:1px solid #E0E4E7;
            color:#90919B;
            font-size:24rpx;
            text-align:center;
            vertical-align:top;
            &.item-lnzt.on {
                background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/index/tab-lnzt.png");
                color:#2575FF;
            }
            &.item-mnks.on {
                background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/index/tab-mnks.png");
                color:#2575FF;
            }
            &.on {
                height:72rpx;
                line-height:72rpx;
                background-repeat:no-repeat;
                background-size:contain;
                border:0 none;
            }
        }
    }
}
</style>