<template>
    <view class="page-user">
        <c-navigation-bar
            title="个人中心"
            style="background:linear-gradient(180deg, #E0ECFF 0%, rgba(255,255,255,0.9) 100%);"
        >
            <template #left></template>
        </c-navigation-bar>

        <view 
            class="user-info"
            @click="isShowInfo = true"
        >
            <view class="face">
                <image src="" />
            </view>
            <view class="name">
                123
            </view>
            <view class="more">主页</view>
        </view>

        <view class="list">
            <view class="item">
                <view class="icon"></view>
                <view class="name">中级会计师职称</view>
            </view>
            <button 
                class="item"
                open-type="share"
            >
                <view class="icon"></view>
                <view class="name">邀请好友</view>
            </button>
        </view>

        <c-userinfo
            :isShowInfo="isShowInfo"
            @cbCloseUserinfo="cbCloseUserinfo"
        >
        </c-userinfo>

        <c-bottom
            :current="1"
            :isShowNav="true"
        >
        </c-bottom>
    </view>
</template>

<script>
export default {
    data(){
        return {
            isShowInfo:false
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){

    },
    methods:{
        cbCloseUserinfo(){
            this.isShowInfo = false
        }
    }
}
</script>

<style lang="scss" scoped>
.page-user {
    min-height:100vh;
    background:#F6F6F6;
    .user-info {
        position:relative;
        padding:0 32rpx;
        height:172rpx;
        line-height:172rpx;
        background:linear-gradient(180deg, #FFF 0%, #FFF 80%,#F6F6F6 100%);
        .face {
            display:inline-block;
            margin-right:32rpx;
            width:116rpx;
            height:116rpx;
            border:3rpx solid #FFF;
            border-radius:50%;
            vertical-align:middle;
            overflow:hidden;
            image {
                width:116rpx;
                height:116rpx;
                border-radius:50%;
                background:#000;
            }
        }
        .name {
            display:inline-block;
            max-width:200rpx;
            color:#1F2626;
            font-size:40rpx;
            vertical-align:middle;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
        .more {
            position:absolute;
            top:50%;
            right:32rpx;
            transform:translateY(-50%);
            padding-right:24rpx;
            color:#90919B;
            font-size:24rpx;
            &:before {
                content:' ';
                position:absolute;
                top:50%;
                right:0;
                transform:translateY(-50%);
                width:12rpx;
                height:20rpx;
                background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_arrow.png") no-repeat;
                background-size:contain;
            }
        }
    }
}

.list {
    padding:32rpx;
    .item {
        position:relative;
        margin-bottom:24rpx;
        padding:0 32rpx;
        height:110rpx;
        line-height:110rpx;
        background:#FFF;
        border-radius:16rpx;
        &::before {
            content:' ';
            position:absolute;
            top:50%;
            right:32rpx;
            transform:translateY(-50%);
            width:12rpx;
            height:20rpx;
            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_arrow.png") no-repeat;
            background-size:contain;
        }
        .icon {
            display:inline-block;
            margin-right:8rpx;
            width:48rpx;
            height:48rpx;
            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_book.png") no-repeat;
            background-size:contain;
            vertical-align:middle;
        }
        .name {
            display:inline-block;
            color:#1F2626;
            font-size:28rpx;
            vertical-align:middle;
        }
    }
    button.item {
        border:1px solid #FFF;
        text-align:left;
        .icon {
            background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_book1.png");
        }
    }
}
</style>