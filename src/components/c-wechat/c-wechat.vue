<template>
    <view 
        class="btn"
        @click="goAddCode"
    >
    </view>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        goAddCode(){
            let path = '/pages/addCode/addCode'
            uni.navigateTo({url:path})
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    position:fixed;
    z-index:9;
    bottom:230rpx;
    right:30rpx;
    width:130rpx;
    height:130rpx;
    background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/addCode.png") no-repeat;
    background-size:contain;
}
</style>