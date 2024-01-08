<template>
    <view class="page-report">
        <c-navigation-bar
            title="试卷详情"
            style="background:#E8F2FF;"
        >
        </c-navigation-bar>

        <view class="mod-detail">
            <view class="detail-container">
                <view class="name">2023年初级会计实务真题 (一)</view>
                <view class="detail">
                    <view class="item">
                        <view class="num"><text>100</text>分</view>
                        <view class="text">试卷总分</view>
                    </view>
                    <view class="item">
                        <view class="num"><text>105</text>分钟</view>
                        <view class="text">考试用时</view>
                    </view>
                </view>
                <view class="list">
                    <view class="item">年份: 2023</view>
                    <view class="item">类型: 历年真题</view>
                </view>
                <view class="list">
                    <view class="item">做过: 53次</view>
                    <view class="item">难度：
                        <view class="star">
                            <text class="on"></text>
                            <text></text>
                            <text></text>
                            <text></text>
                            <text></text>
                        </view>
                    </view>
                </view>
                <view class="actions">
                    <view class="btn">练习模式</view>
                    <view class="btn blue">考试模式</view>
                </view>
            </view>
        </view>

        <view class="mod-desc">
            <view class="title">题型介绍</view>
            <view class="item">
                <view class="hd">单选题</view>
                <view class="bd">共20道题，每道题2.0分。</view>
            </view>
            <view class="item">
                <view class="hd">试卷说明</view>
                <view class="bd">2023年初级会计实务真题（一）</view>
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getQuestionByPaperIdApi } from '@/utils/api'
export default {
    data(){
        return {
            paperDetail:{},
        }
    },
    onLoad(e){
        this.options = e
        
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
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).questionGroupList

                    this.paperDetail = data
                    console.log(999,data)
                }

            })    
        }
    }
}
</script>

<style lang="scss" scoped>
.page-report {
    min-height:100vh;
    background:#FFF;
}

.mod-detail {
    padding:24rpx 32rpx 64rpx 32rpx;
    background:#E8F2FF;
    .detail-container {
        padding:32rpx;
        background:#FFF;
        border:2rpx solid #DAE3EF;
        border-radius:24rpx;
        text-align:center;
        .name {
            margin-bottom:40rpx;
            line-height:40rpx;
            color:#000222;
            font-size:32rpx;
            font-weight:500;
        }
        .detail {
            margin-bottom:24rpx;
            display:flex;
            .item {
                flex:1;
                &:last-child {
                    position:relative;
                    &:before {
                        content:' ';
                        position:absolute;
                        top:50%;
                        left:0;
                        transform:translateY(-50%);
                        width:1px;
                        height:48rpx;
                        background:#EBEBEB;
                    }
                }
                .num {
                    line-height:50rpx;
                    color:#2575FF;
                    font-size:32rpx;
                    text {
                        font-size:50rpx;
                        font-weight:500;
                    }
                }
                .text {
                    margin-top:8rpx;
                    line-height:32rpx;
                    color:#000222;
                    font-size:24rpx;
                }
            }
        }
        .list {
            display:flex;
            margin-bottom:16rpx;
            .item {
                flex:1;
                color:#90919B;
                font-size:24rpx;
                .star {
                    display:inline-block;
                    vertical-align:middle;
                    text {
                        display:inline-block;
                        margin-right:4rpx;
                        width:24rpx;
                        height:24rpx;
                        background:#EEE;
                        vertical-align:top;
                        &.on {
                            background:#000;
                        }
                    }
                }
            }
        }
        .actions {
            display:flex;
            margin-top:44rpx;
            .btn {
                flex:1;
                width:330rpx;
                height:80rpx;
                line-height:80rpx;
                border:2rpx solid #2575FF;
                border-radius:40rpx;
                color:#2575FF;
                font-size:24rpx;
                text-align:center;
                &.blue {
                    margin-left:24rpx;
                    background:#2575FF;
                    color:#FFF;
                }
            }
        }
    }
}

.mod-desc {
    position:relative;
    padding:32rpx;
    &:before {
        content:' ';
        position:absolute;
        top:-20rpx;
        left:0;
        width:100%;
        height:20rpx;
        border-radius:24rpx 24rpx 0 0;
        background:#FFF;
    }
    .title {
        height:32rpx;
        line-height:32rpx;
        color:#000222;
        font-size:30rpx;
        font-weight:500;
    }
    .item {
        margin-top:32rpx;
        font-size:28rpx;
        .hd {
            margin-bottom:16rpx;
            line-height:32rpx;
            color:#000222;
        }
        .bd {
            line-height:40rpx;
            color:#90919B;
        }
    }
}
</style>