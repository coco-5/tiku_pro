<template>
    <view class="no-content">
        {{title}}
    </view>
</template>

<script>
export default {
    props:{
        title:{
            type:String,
            default:'暂无内容'
        }
    },
    data(){
        return{}
    }
}
</script>

<style lang="scss" scoped>
.no-content {
    margin:40rpx 0;
    color:#999;
    font-size:40rpx;
    font-weight:500;
    text-align:center;
}
</style>