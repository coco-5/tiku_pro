<template>
    <view class="sea">
        <view class="hd">题海练习</view>
        <view class="bd">
            <view class="process">
                <view class="block"></view>
                <view class="text"><text>100</text>/1000</view>
            </view>
            <view class="rate">
                <text>80%</text>正确率
            </view>
            <view class="btn">开始练习</view>
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

        }
    },
    created(){

    },
    methods:{

    }
}
</script>

<style lang="scss" scoped>
.sea {
    padding:32rpx 32rpx 0;
    background:linear-gradient(180deg, #FFF 0%, #F6F6F6 100%);
    .hd {
        height:76rpx;
        line-height:76rpx;
        color:#010B16;
        font-size:32rpx;
        font-weight:500;
    }
    .bd {
        position:relative;
        height:336rpx;
        background:#FFF;
        border:2rpx solid #FFF;
        border-radius:24rpx;
        text-align:center;
        overflow:hidden;
        .process {
            position:relative;
            margin:52rpx 32rpx 0;
            height:32rpx;
            background:#E8EFF8;
            border-radius:19rpx;
            .block {
                position:absolute;
                top:0;
                left:0;
                width:50%;
                height:32rpx;
                background:linear-gradient(90deg, #73ADFF 0%, #00D5F1 53%, #73ADFF 100%);
                border-radius:19rpx;
            }
            .text {
                position:absolute;
                top:50%;
                left:50%;
                transform:translateY(-50%);
                padding:0 12rpx;
                height:48rpx;
                line-height:48rpx;
                background:#FFF;
                border-radius:8rpx;
                box-shadow:0rpx 0rpx 60rpx 0rpx rgba(185,194,208,0.5);
                color:#90919B;
                font-size:20rpx;
                font-weight:500;
                text {
                    color:#000222;
                    font-size:24rpx;
                }
            }
        }
        .rate {
            margin:40rpx auto;
            height:40rpx;
            line-height:40rpx;
            color:#000222;
            font-weight:500;
            font-size:28rpx;
            text {
                font-size:36rpx;
            }
        }
        .btn {
            position:absolute;
            bottom:40rpx;
            left:50%;
            transform:translateX(-50%);
            width:388rpx;
            height:88rpx;
            line-height:88rpx;
            border-radius:44rpx;
            border:2rpx solid #EFF2F5;
            color:#2575FF;
            font-size:32rpx;
        }
    }
}
</style>