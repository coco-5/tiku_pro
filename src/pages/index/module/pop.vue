<template>
    <view class="pop">
        <view class="hd">
            <view
                class="close"
                @click="cbClosePop"
            > 
            </view>
            <view class="title">2024年真题尚未开通</view>
        </view>
        <view class="bd">
            <view class="title">添加助教依依</view>
            <view class="desc">直接领取20~24年全部真题试卷和答案解析</view>
            <view class="desc">订阅朋友圈每日学习打卡</view>
            <image 
                src="https://oss-hqwx-edu24ol.oss-cn-beijing.aliyuncs.com/miniapp/takepicture/packageAiKefu/code.png" 
                show-menu-by-longpress="true"
            />
            <view class="tips">长按识别二维码添加</view>
        </view>
    </view>
</template>

<script>
export default {
    props:{},
    data(){
        return{

        }
    },
    mounted(){

    },
    methods:{
        cbClosePop(){
            this.$emit('cbClosePop')
        }
    }
}
</script>

<style lang="scss" scoped>
.pop {
    overflow:hidden;
    .hd {
        position:relative;
        margin:60rpx 0 40rpx;
        height:50rpx;
        line-height:50rpx;
        color:#000222;
        font-size:36rpx;
        font-weight:600;
        text-align:center;
        .close {
            position:absolute;
            top:50%;
            right:32rpx;
            transform:translateY(-50%);
            width:36rpx;
            height:36rpx;
            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_close.png") no-repeat;
            background-size:contain;
        }
        .title {

        }
    }
    .bd {
        padding:32rpx; 
        text-align:center;
        .title {
            margin-bottom:24rpx;
            color:#000222;
            font-size:36rpx;
            font-weight:600; 
        }
        .desc {
            margin:0 0 12rpx;
            color:#000222;
            font-size:34rpx;
            font-weight:600; 
        }
        image {
            margin-top:32rpx;
            width:401rpx;
            height:401rpx;
        }
    }
}
</style>