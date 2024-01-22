<template>
    <view class="page-report">
        <c-navigation-bar
            title="试卷详情"
            style="background:#E8F2FF;"
        >
        </c-navigation-bar>

        <view class="mod-detail">
            <view class="detail-container">
                <view class="name">{{paperDetail.name || ''}}</view>
                <view class="detail">
                    <view class="item">
                        <view class="num"><text>{{paperDetail.totalScore || 0 }}</text>分</view>
                        <view class="text">试卷总分</view>
                    </view>
                    <view class="item">
                        <view class="num"><text>{{paperDetail.answerTime}}</text>分钟</view>
                        <view class="text">考试用时</view>
                    </view>
                </view>
                <view class="list">
                    <view class="item">年份: {{paperDetail.year}}</view>
                    <view class="item">类型: {{paperDetail.type == 1 ? '历年真题' : '模拟考试'}}</view>
                </view>
                <view class="list">
                    <view class="item">做过: {{paperDetail.practicingNums}}次</view>
                    <view class="item">难度：
                        <view class="star">
                            <view class="block">
                                <text
                                    :class="{on:indexStart < paperDetail.difficulty}"
                                    v-for="(itemStart,indexStart) in 5"
                                    :key="indexStart"
                                >
                                </text>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="actions">
                    <view 
                        class="btn"
                        @click="goPractise(1)"
                    >
                        练习模式
                    </view>
                    <view 
                        class="btn blue"
                        @click="goPractise(2)"
                    >
                        考试模式
                    </view>
                </view>
            </view>
        </view>

        <view class="mod-desc">
            <!-- <view class="title">题型介绍</view>
            <template
                v-if="paperDetail.questionGroupList.length > 0"
            >
                <view 
                    class="item"
                    v-for="(item,index) in paperDetail.questionGroupList"
                    :key="index"
                >
                    <view class="hd">{{item.name}}</view>
                    <view class="bd">{{item.description}}</view>
                </view>
            </template> -->
            <view 
                class="item"
                v-if="paperDetail.description"
            >
                <view class="hd">试卷说明</view>
                <view class="bd">{{paperDetail.description}}</view>
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getDetailByPaperIdApi } from '@/utils/api'
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
        this.getDetail()
    },
    methods:{
        getDetail(){
            let params = {
                paperId:this.options.paperId
            }
        
            getDetailByPaperIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))

                    this.paperDetail = data
                }
            })    
        },
        goPractise(state){
            //mode 3 历年真题 4 模拟考试
            //type 1 做题
            //state 1 练习模式 2 考试模式
            let params = {
                paperId:this.options.paperId,
                type:1,
                state,
                mode : this.options.mode
            }
            let url = `/packagePractise/pages/practise/practise?${this.$hq.utils.paramsStringify(params)}`
            uni.navigateTo({
                url : url
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
                            vertical-align:top;
                            &.on {
                                background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_star.png");
                            }
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
                font-size:30rpx;
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