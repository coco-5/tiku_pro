<template>
    <view 
        class="tab"
        v-if="list.length > 0"
    >
        <scroll-view
            class="tab-content"
            scroll-x
        >
            <view 
                class="item"
                :class="{'on': index === current}"
                @click="changeIndex(index)"
                v-for="(item, index) in list"
                :key="index"
            >
                {{item}}
            </view>  
        </scroll-view>
        <view class="more"></view>
    </view>
</template>

<script>
export default {
    props:{
        list:{
            type:Array
        },
        current:{
            type:Number
        }
    },
    watch:{
        list:{
            deep:true,
            handler(nv){
            }
        }
    },
    data(){
        return {

        }
    },
    created(){
    },
    methods:{
        changeIndex(index){
            this.$emit('change', index)
        }
    }
}
</script>

<style lang="scss" scoped>
.tab {
    position:relative;
    padding-right:86rpx;
    height:96rpx;
    line-height:96rpx;
    background:#FFF;
    .tab-content {
        padding:0 32rpx;
        white-space:nowrap;
        height:96rpx;
        .item {
            display:inline-block;
            margin-right:32rpx;
            color:#000222;
            font-size:28rpx;
            vertical-align:middle;
            &:last-child {
                margin-right:0;
            } 
            &.on {
                font-weight:500;
                font-size:32rpx;
            }   
        }
    }
    .more {
        position:absolute;
        top:0;
        right:0;
        width:86rpx;
        height:96rpx;
        background:#EEE;
    }
}
</style>