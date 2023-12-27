<template>
    <swiper 
        class="swiper" 
        :style="[customThemeStyle]" 
        duration="300" 
        @animationfinish="changeSwiper" 
        :current="current"
    >	
        <swiper-item 
            v-for="(item,index) in list" 
            :key="index"
        >
            <view class="q-top">
                <view class="q-type">单选题</view>
                <view class="process"><text>{{index+1}}</text>/{{list.length}}</view>
            </view>

            <view class="title">
                <rich-text nodes="考试分中学(含中等职业学校)、小学和幼儿园3个级别（   ）"></rich-text>
            </view>

            <view class="list-options">
                <view class="item">
                    <view class="label checked">A</view>
                    <view class="text">
                        <rich-text nodes="1111"></rich-text>
                    </view>
                </view>
                <view class="item">
                    <view class="label right">B</view>
                    <view class="text">
                        <rich-text nodes="多孔菌科大将风度空间的反馈大家发空间的开发 打客服健康的减肥开始打开进风口的减肥"></rich-text>
                    </view>
                </view>
                <view class="item">
                    <view class="label error">C</view>
                    <view class="text">
                        <rich-text nodes="多孔菌科大将风度空间的反馈大家发空间的开发 打客服健康的减肥开始打开进风口的减肥"></rich-text>
                    </view>
                </view>
            </view>

            <view class="mod-answer">
                <view class="hd">答案解析</view>
                <view class="bd">
                    <view class="a">正确答案：B</view>
                    <view class="b">你的答案：D</view>
                    <view class="c">回答错误</view>
                </view>
            </view>

            <view class="mod-analysis">
                <view class="hd">题目解析</view>
                <view class="bd">
                    <rich-text nodes="12121"></rich-text>
                </view>
            </view>
        </swiper-item>
    </swiper>
</template>

<script>
// type 1做题 2解析 3查看，没有解析
// mode 1题海 2章节 3历年真题 4模拟考试
// state 1练习 2考试
export default {
    props:{
        list:{
            type:Array,
            default:[]
        },
        current:{
            type:[String,Number],
            default:0
        }
    },
    watch:{
        list:{
            deep:true,
            handler(n){}
        },
        current:{
            deep:true,
            handler(n){
            }
        }
    },
    data(){
        return {
            swiperList:[],
            subCurrent:0,//小题索引
            questionType:{
                "0": "单选题",
                "1": "多选题",
                "2": "不定项",
                "3": "判断题",
                "4": "填空题",
                "5": "简答题",
                "6": "案例题",
                "7": "论述题",
            },
            customThemeStyle:{
                '--process-color':'#366DE8',   //做题进度字体颜色
                '--multi-tab-active-color':'#5074FF',  //多小题tab选择颜色
                '--option-checked-background':'#366DE8', //答题时，选择选项背景色
                '--option-right-background':'#4BCD8A',   //解析时，正确答案选项背景色
                '--option-error-background':'#EB5B5A',   //解析时，打错选项背景色
            }
        }
    },
    created(){
    },
    methods:{
        changeSwiper(e){
            this.$emit('change',e.detail.current)
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper {
    height:100%;
    background:#FFF;
}
.q-top {
    position:relative;
    margin:32rpx 32rpx 24rpx;
    height:48rpx;
    line-height:48rpx;
    .q-type {
        display:inline-block;
        padding:0 24rpx;
        background:#F0F1F3;
        border-radius:24rpx;
        color:#90919B;
        font-size:24rpx;
        vertical-align:middle;
    }
    .process {
        position:absolute;
        top:0;
        right:0;
        height:48rpx;
        color:#ADB0B6;
        font-size:28rpx;
        text {
            display:inline-block;
            margin-right:4rpx;
            color:#2575FF;
            font-size:28rpx;
            vertical-align:middle;
        }
    }
}

.title {
    padding:0 32rpx;
    line-height:40rpx;
    color:#000222;
    font-size:30rpx;
}

.list-options {
    padding:48rpx 32rpx 0;
    border-bottom:16rpx solid #F6F6F6;
    .item {
        position:relative;
        margin-bottom:40rpx;
        padding-left:96rpx;
        min-height:72rpx;
        line-height:72rpx;
        color:#000222;
        font-size:28rpx;
        .label {
            position:absolute;
            top:50%;
            left:0;
            transform:translateY(-50%);
            width:72rpx;
            line-height:72rpx;
            background:#F4F5F8;
            border-radius:36rpx;
            color:#3D4044;
            text-align:center;
            &.checked {
                background: var(--option-checked-background);
                color:#FFF;
            }
            &.right {
                background:var(--option-right-background);
                color:#FFF;
            }
            &.error {
                background:var(--option-error-background);
                color:#FFF;
            }
        }
        .text {
            display:inline-block;
            line-height:36rpx;
            vertical-align:middle;
        }
    }
}

.mod-answer {
    margin:0 32rpx;
    padding:40rpx 0;
    border-bottom:1rpx solid #EBECEE;
    .hd {
        margin-bottom:24rpx;
        height:32rpx;
        line-height:32rpx;
        color:#000222;
        font-size:30rpx;
    }
    .bd {
        position:relative;
        font-size:28rpx;
        view {
            display:inline-block;
            vertical-align:middle;
            &.a {
                margin-right:40rpx;
                color:#00D6C1;
            }
            &.b {
                color:#FF5151;
            }
            &.c {
                position:absolute;
                top:0;
                right:0;
                color:#90919B;
            }
        }
    }
}

.mod-analysis {
    padding:40rpx 32rpx;
    .hd {
        margin-bottom:24rpx;
        height:32rpx;
        line-height:32rpx;
        color:#000222;
        font-size:30rpx;
    }
    .bd {
        color:#90919B;  
        font-size:28rpx;   
    }
}
</style>