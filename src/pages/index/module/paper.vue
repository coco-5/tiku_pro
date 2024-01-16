<template>
    <view class="paper">
        <view class="hd">真题考试<text>刷题 题目大合集</text></view>
        <view class="bd">
            <view class="tab">
                <view 
                    class="item"
                    :class="{on:tabIndex == index}"
                    @click="changeTab(index)"
                    v-for="(item,index) in tabList"
                    :key="index"
                >
                    {{item.name}}
                </view>
            </view>
            <view 
                class="list"
                v-if="!loading && paperList[tabIndex].length"
            >
                <view 
                    class="item"
                    v-for="(item,index) in paperList[tabIndex]"
                    :key="index"
                >
                    <view class="name">{{item.name || ''}}</view>
                    <view class="desc">
                        <view class="done">已做:<text>{{item.practicingNums || 0}}人</text></view>
                        <view class="star">
                            难度：
                            <view class="block">
                                <text
                                    :class="{on:indexStart < item.difficulty}"
                                    v-for="(itemStart,indexStart) in 5"
                                    :key="indexStart"
                                >
                                </text>
                            </view>
                        </view>
                    </view>
                    <view 
                        class="btn"
                        @click="goDetail(item)"
                    >   
                        练习
                    </view>
                </view>
                <view 
                    class="more"
                    @click="goMore"
                >
                    <text>查看更多</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getPaperBySubjectIdApi } from '@/utils/api'
export default {
    props:{
        examInfo:{
            type:Object
        }
    },
    watch:{
        examInfo:{
            deep:true,
            handler(n){
                if(n){
                    this.getPaper()
                }
            }
        }
    },
    data(){
        return {
            loading:false,
            tabList:[
                {
                    type:'linianzhenti',
                    name:'历年真题',
                    type:1
                },
                {
                    type:'monikaoshi',
                    name:'模拟考试',
                    type:2
                }
            ],
            tabIndex:0,
            paperList:[[],[]]
        }
    },
    mounted(){
    },
    methods:{
        getPaper(){
            if(this.paperList[this.tabIndex].length > 0){
                return
            }

            let params = {
                subjectId:uni.getStorageSync('subjectInfo').id,
                type:this.tabList[this.tabIndex],
                pageSize:3,
                pageNum:1
            }
        
            getPaperBySubjectIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).paperDTOList

                    this.$set(this.paperList,this.tabIndex,data)
                }
            })  

        },
        changeTab(index){
            this.tabIndex = index
        },
        goDetail(item){
            let mode = this.tabList[this.tabIndex].type == 1 ? 3 : 4
            let params = {
                paperId:item.id,
                mode
            }
            uni.navigateTo({
                url : `/packagePractise/pages/paperDetail/paperDetail?${this.$hq.utils.paramsStringify(params)}`
            })
        },
        goMore(){
            //1历年真题 2模拟考试
            let type = this.tabList[this.tabIndex].type
            let params = {
                paperType:type  
            }
            uni.navigateTo({
                url : `/packagePractise/pages/paperList/paperList?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.paper {
    padding:32rpx;
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
            border:1rpx solid #E0E4E7;
            border-radius:8rpx;
            color:#90919B;
            font-size:24rpx;
            text-align:center;
            vertical-align:top;
            &.on {
                //height:72rpx;
                //line-height:72rpx;
                color:#2575FF;
                //background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/tab.png") no-repeat;
                //background-size:contain;
            }
        }
    }
    .list {
        background:#FFF;
        border:2rpx solid #EFF2F5;
        border-radius:24rpx;
        .item {
            position:relative;
            padding:32rpx 178rpx 16rpx 24rpx;
            .name {
                margin-bottom:8rpx;
                height:40rpx;
                line-height:40rpx;
                color:#000222;
                font-size:28rpx;
                font-weight:500;
                white-space:nowrap;
                overflow:hidden;
                text-overflow:ellipsis;
            }
            .desc {
                height:32rpx;
                line-height:32rpx;
                color:#90919B;
                font-size:24rpx;
                .done,
                .star {
                    display:inline-block;
                    vertical-align:middle;
                }
                .done {
                    margin-right:24rpx;
                    text {
                        color:#000222;
                    }
                }
                .star {
                    .block {
                        display:inline-block;
                        height:24rpx;
                        vertical-align:top;
                        text {
                            display:inline-block;
                            width:24rpx;
                            height:24rpx;
                            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_star1.png") no-repeat;
                            background-size:contain;
                            vertical-align:middle;
                            &.on {
                                background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_star.png");
                            }
                        }
                    }
                }
            }
            .btn {
                position:absolute;
                top:50%;
                right:32rpx;
                transform:translateY(-50%);
                width:146rpx;
                height:64rpx;
                line-height:64rpx;
                border:3rpx solid #EFF2F5;
                border-radius:46rpx;
                color:#2575FF;
                font-size:26rpx;
                text-align:center;
            }
        }
        .more {
            padding:16rpx 0 40rpx;
            height:32rpx;
            line-height:32rpx;
            color:#ADB1B5;
            font-size:24rpx;
            text-align:center;
            text {
                position:relative;
                padding-right:32rpx;
                &:before {
                    content:' ';
                    position:absolute;
                    top:50%;
                    right:0;
                    transform:translateY(-50%);
                    width:24rpx;
                    height:24rpx;
                    background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_more.png") no-repeat;
                    background-size:contain;
                }
            }
        }
    }
}
</style>