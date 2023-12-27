<template>
    <view class="paper">
        <view class="hd">章节练习<text>刷题 题目大合集</text></view>
        <view class="bd">
            <view class="tab">
                <view 
                    class="item"
                    :class="{on:tabIndex == index}"
                    v-for="(item,index) in tabList"
                    :key="index"
                >
                    {{item.name}}
                </view>
            </view>
            <view 
                class="list"
                v-if="!loading && paperList[tabIndex].list.length"
            >
                <view 
                    class="item"
                    v-for="(item,index) in paperList[tabIndex].list"
                    :key="index"
                >
                    <view class="name">2023年初级会计实务真题(一)</view>
                    <view class="desc">
                        <view class="done">已做:<text>53人</text></view>
                        <view class="star">
                            难度：
                            <view class="block">
                                <text class="on"></text>
                                <text></text>
                                <text></text>
                                <text></text>
                                <text></text>
                            </view>
                        </view>
                    </view>
                    <view class="btn">练习</view>
                </view>
                <view class="more">
                    <text>查看更多</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{

    },
    watch:{

    },
    data(){
        return {
            loading:false,
            tabList:[
                {
                    type:'linianzhenti',
                    name:'历年真题'
                },
                {
                    type:'monikaoshi',
                    name:'模拟考试'
                }
            ],
            tabIndex:0,
            paperList:[{
                list:[1,2,3]
            },{}]
        }
    },
    mounted(){
    },
    methods:{}
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
                color:#2575FF;
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
                            margin-right:4rpx;
                            width:24rpx;
                            height:24rpx;
                            background:#EEE;
                            vertical-align:middle;
                            &.on {
                                background:#000;
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
                    background:#EEE;
                }
            }
        }
    }
}
</style>