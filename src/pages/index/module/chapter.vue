<template>
    <view class="chapter">
        <view class="hd">章节练习</view>
        <view class="bd">
            <view class="list">
                <view 
                    class="item"
                    v-for="(item,index) in userExerciseList"
                    :key="index"
                >
                    <view class="pic">
                        <text 
                            class="icon"
                            :class="item.icon"
                        ></text>
                        {{item.name}}</view>
                    <view class="text">
                        <text>{{item.value}}</text>%
                    </view>
                </view>
            </view>
            <viiew class="actions">
                <view 
                    class="btn"
                    @click="goChapter"
                >   
                    开始练习
                </view>
            </viiew>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        examInfo:{
            type:[String,Object],
            default:''
        }
    },
    watch:{
        examInfo:{
            immediate:true,
            deep:true,
            handler(nv){
                if(nv.gid){
                    this.getUserExercise(nv.gid)
                }   
            }
        }
    },
    data() {
        return {
            userExerciseList:[
                {
                    type:'total',
                    name:'总练习数',
                    icon:'icon1',
                    value:0
                },
                {
                    type:'rate-finish',
                    name:'完成率',
                    icon:'icon2',
                    value:0
                },
                {
                    type:'rate-correct',
                    name:'正确率',
                    icon:'icon3',
                    value:0
                }
            ]
        }
    },
    mounted(){
        
    },
    methods:{
        goChapter(){
            uni.navigateTo({
                url:`/packagePractise/pages/chapter/chapter?gid=`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.chapter {
    padding:32rpx 32rpx 0;
    .hd {
        height:76rpx;
        line-height:76rpx;
        color:#010B16;
        font-size:32rpx;
        font-weight:500;
    }
    .bd {
        position:relative;
        height:374rpx;
        background:#FFF;
        border:2rpx solid #FFF;
        border-radius:24rpx;
        text-align:center;
        overflow:hidden;
        .list {
            display:flex;
            padding:40rpx 32rpx 0;
            .item {
                flex:1;
                margin-right:16rpx;
                width:196rpx;
                height:162rpx;
                background:#FAFAFA;
                border-radius:16rpx;
                text-align:left;
                &:last-child {
                    margin-right:0;
                }
                .pic {
                    position:relative;
                    padding-top:36rpx;
                    padding-left:32rpx;
                    height:34rpx;
                    line-height:34rpx;
                    color:#000222;
                    font-size:24rpx;
                    .icon {
                        display:inline-block;
                        margin-top:-4rpx;
                        margin-right:8rpx;
                        width:26rpx;
                        height:26rpx;
                        background-repeat:no-repeat;
                        background-size:contain;
                        vertical-align:middle;
                        &.icon1 {
                            background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_pen.png");
                        }
                        &.icon2 {
                            background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_ok.png");
                        }
                        &.icon3 {
                            background-image:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_ok1.png");
                        }
                    }
                }
                .text {
                    margin-top:8rpx;
                    padding-left:32rpx;
                    color:#000222;
                    font-size:24rpx;
                    text {
                        font-size:48rpx;
                        font-weight:500;
                    }
                }
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