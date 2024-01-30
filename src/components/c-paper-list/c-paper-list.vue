<template>
    <view 
        class="list"
        :style="listStyle"
    >
        <view 
            class="item"
            v-for="(item, index) in list"
            :key="index"
        >
            <view class="name">{{item.name || ''}}</view>
            <view class="desc">
                <view class="done">已做:<text>{{item.practicingNums || 0}}人</text></view>
                <view class="star">
                    难度：
                    <view class="block">
                        <text
                            :class="{on:indexStart < item.difficulty}"
                            v-for="(itemStart,indexStart) in 5"
                            :key="indexStart"
                        >
                        </text>
                    </view>
                </view>
            </view>
            <view 
                class="btn"
                @click="goPractise(item)"
            >
                练习
            </view>
        </view>
        <view 
            class="more"
            @click="goMore"
            v-if="isMore"
        >
            查看更多
        </view>
    </view>
</template>

<script>
export default {
    props:{
        mode:{
            type:[String,Number]
        },
        list:{
            type:Array
        },
        listStyle:{
            type:String
        },
        isMore:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        list:{
            deep:true,
            handler(n){}
        },
        mode:{
            deep:true,
            handler(n){
            }
        }
    },
    data(){
        return{
            
        }
    },
    created(){
    },
    methods:{
        goPractise(item){
            let params = {
                paperId:item.id,
                mode:this.mode
            }
            uni.navigateTo({
                url : `/packagePractise/pages/paperDetail/paperDetail?${this.$hq.utils.paramsStringify(params)}`
            })
        },
        goMore(){
            //3历年真题 4模拟考试
            let params = {
                mode:this.mode  
            }
            uni.navigateTo({
                url : `/packagePractise/pages/paperList/paperList?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    }
}
</script> 

<style lang="scss" scoped>
.list {
    .item {
        box-sizing:border-box;
        position:relative;
        margin-bottom:24rpx;
        padding:32rpx 100rpx 32rpx 32rpx;
        background:#FFF;
        border-radius:24rpx;
        .name {
            width:85%;
            max-height:80rpx;
            line-height:40rpx;
            color:#000222;
            font-size:28rpx;
            font-weight:500;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient:vertical;
            overflow-wrap:break-word;
            word-break:break-all;
            white-space:normal;
            overflow:hidden;
        }
        .desc {
            height:40rpx;
            line-height:40rpx;
            color:#90919B;
            font-size:24rpx;
            .done {
                display:inline-block;
                margin-right:16rpx;
                vertical-align:middle;
                text {
                    color:#000222;
                }
            }
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
                        vertical-align:middle;
                        &.on {
                            background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_star.png");
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
            border-radius:32rpx;
            color:#2575FF;
            font-size:26rpx;
            text-align:center;
        }
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
            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_more.png") no-repeat;
            background-size:contain;
        }
    }
}
</style>