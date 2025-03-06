<template>
    <view class="page">
        <c-navigation-bar
            style="background:transparent;"
            backType="1"
        >
        </c-navigation-bar>
        <div class="qrcode">
            <image 
                class="qrcode" 
                :src="codeImage" 
                show-menu-by-longpress="true" />
        </div>
    </view>
</template>

<script>
export default{
    data(){
        return{
            codeImage:'https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/qrcode.jpg'
        }
    }
}
</script>

<style lang="scss" scoped>
.page {
    background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/bg_codde.png");
    background-size:cover;
    height:1624rpx;
    overflow:hidden;
}

.qrcode {
    margin:240rpx auto 0;
    text-align:center;
    image {
        width:400rpx;
        height:400rpx;
    }
}
</style>

