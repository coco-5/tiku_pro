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
            <view 
                class="swiper-page"
                :class="(item.quType == 5 ? 'swiper-anli' : '') + (isShowQuestion ? '' : ' hide-question')"
            >
                <view class="q-top">
                    <view class="q-type">{{questionType[item.quType]}}</view>
                    <view class="process"><text>{{index+1}}</text>/{{list.length}}</view>
                </view>

                <view class="title">
                    <rich-text :nodes="item.showContent"></rich-text>
                </view>

                <view 
                    class="question-hd"
                    v-if="item.quType == 5"
                >
                    <view 
                        class="bar" 
                        @click="controlHeadBar">
                    </view>
                    <view class="nav">
                        <scroll-view 
                            class="nav-scroll"
                            scroll-x
                        >
                            <view 
                                class="item"
                                :class="subCurrent == indexDetail ? 'on' : ''"
                                @click="changeSub(indexDetail)"
                                v-for="(itemDetail,indexDetail) in item.questionDetailList"
                                :key="indexDetail"
                            >
                                {{indexDetail+1}}-{{index+1}}
                            </view>
                        </scroll-view>
                    </view>
                </view>

                <view class="question-bd">
                    <view 
                        class="bd-item"
                        v-show="subCurrent == indexDetail"
                        v-for="(itemDetail,indexDetail) in item.questionDetailList"
                        :key="indexDetail"
                    >
                        <rich-text 
                            class="item-title" 
                            :nodes="itemDetail.showContent"
                            v-if="item.quType == 5"
                        >
                        </rich-text>

                        <template v-if="item.quType == 4">
                            <view class="textarea">
                                <textarea 
                                    maxlength="500" 
                                    :disabled="options.type != 1" 
                                    @input="input($event,subItem, 0)" 
                                    placeholder="输入你的答案..." 
                                    placeholder-style="color:#999"
                                ></textarea>
                                <text class="tips">注：本试题为主观题，请参考解析自行评分</text>
                            </view>
                        </template>

                        <template v-else>
                            <view class="list-options">
                                <view 
                                    class="item"
                                    :class="item.quType == 2 ? '' : 'option-multiple'"
                                    @click="chooseoOption(item, itemAnswer)"
                                    v-for="(itemAnswer,indexAnswer) in itemDetail.answerList"
                                    :key="indexAnswer"
                                >
                                    <view 
                                        class="label"
                                        :class="{
                                            checked:options.type == 1  && checkUserChoose(itemAnswer.questionId,itemAnswer.seq)
                                        }"
                                    >
                                        {{itemAnswer.seq}}
                                    </view>
                                    <view class="text">
                                        <rich-text :nodes="itemAnswer.showContent"></rich-text>
                                    </view>
                                </view>
                            </view>
                        </template>
                            
                    </view>
                </view>

                <view 
                    class="mod-answer"
                    v-if="options.type == 2"
                >
                    <view class="hd">答案解析</view>
                    <view class="bd">
                        <view class="a">正确答案：B</view>
                        <view class="b">你的答案：D</view>
                        <view class="c">回答错误</view>
                    </view>
                </view>

                <view 
                    class="mod-analysis"
                    v-if="options.type == 2"
                >
                    <view class="hd">题目解析</view>
                    <view class="bd">
                        <rich-text nodes="12121"></rich-text>
                    </view>
                </view>
            </view>
        </swiper-item>
    </swiper>
</template>

<script>
// type 1做题 2解析 3查看，没有解析
// mode 1题海 2章节 3历年真题 4模拟考试
// state 1练习 2考试
import utils from '@/utils/utils'
export default {
    props:{
        options:{
            type:Object
        },
        list:{
            type:Array,
            default:[]
        },
        current:{
            type:[String,Number],
            default:0
        },
        answerDataObj:{
            type:Object,
        }
    },
    watch:{
        list:{
            deep:true,
            handler(n){
                
            }
        },
        current:{
            deep:true,
            handler(n){
                this.isShowQuestion = true
                this.subCurrent = 0
            }
        },
        answerDataObj:{
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
                "1": "判断题",
                "2": "单选题",
                "3": "多选题",
                "4": "简答题",
                "5": "案例题"
            },
            customThemeStyle:{
                '--process-color':'#366DE8',   //做题进度字体颜色
                '--multi-tab-active-color':'#5074FF',  //多小题tab选择颜色
                '--option-checked-background':'#366DE8', //答题时，选择选项背景色
                '--option-right-background':'#4BCD8A',   //解析时，正确答案选项背景色
                '--option-error-background':'#EB5B5A',   //解析时，打错选项背景色
            },
            isShowQuestion:true
        }
    },
    created(){
    },
    methods:{
        changeSwiper(e){
            this.$emit('change',e.detail.current)
        },
        changeSub(index){
            this.subCurrent = index
        },
        // 问答/简答
        input(e,item,index){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            this.timer = setTimeout(()=>{
                console.log(999,111,e.detail.value)
            },300)
        },
        // 选择答案
        chooseoOption(item, itemAnswer){
            if(this.options.type != 1) return 

            let answerItem = this.answerDataObj[itemAnswer['questionId']] || {
                questionId : itemAnswer.questionId,
                seq : [],
                answer : ''
            }
            let ansIndex = answerItem.seq.indexOf(itemAnswer.seq)

            // 单选或者判断题
            if(item.quType == 1 || item.quType == 2){
                answerItem.seq = ansIndex > -1 ? [] : [itemAnswer.seq]
                if(ansIndex > -1){
                    // 取消选择
                    delete this.answerDataObj[itemAnswer.questionId]
                }else{
                    this.$set(this.answerDataObj,itemAnswer.questionId,answerItem)
                }
                // 下一题
                if(answerItem.seq.length > 0){
                    this.next()
                }
            }else{
                if(ansIndex > -1){
                    // 取消选择
                    answerItem.seq.splice(ansIndex,1)
                }else{
                    answerItem.seq.push(itemAnswer.seq)
                }
                if(answerItem.seq.length == 0){
                    delete this.answerDataObj[itemAnswer.questionId]
                }else{
                    this.$set(this.answerDataObj,itemAnswer.questionId,answerItem)
                }
            }
            this.$emit('answer',this.answerDataObj)
        },
        next(){
            let item = this.list[this.current]

            if(item.quType != 5){
                this.$emit('change',this.current+1)
            }
        },
        checkUserChoose(id,seq){
            if(this.answerDataObj && this.answerDataObj[id] && this.answerDataObj[id].seq.indexOf(seq) > -1) return true
            return false
        },
        checkUserChoose2(answer_option,seq){
            if(answer_option.indexOf(seq) > -1) return true
            return false
        },
        checkUserChoose3(id,seq,answer_option){
            if(this.answerDataObj && this.answerDataObj[id] && this.answerDataObj[id].answer.indexOf(seq) > -1 && answer_option.indexOf(seq) == -1) return true
            return false
        },
        controlHeadBar(){
            this.isShowQuestion = !this.isShowQuestion
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper {
    height:100%;
    background:#FFF;
}

.swiper-page {
    position:relative;
    height:100%;
    overflow:auto;
    &.swiper-anli {
        .title {
            height:40%;
            overflow-y:auto;
        }
        .bd-item {
            margin-top:24rpx;
        }
    }
    &.hide-question {
        .title {
            height:80%;
        }
        .question-hd {
            position:absolute;
            bottom:0;
            left:0;
            width:100%;
        }
        .question-bd {
            display:none;
        }
    }
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
    padding:32rpx;
    line-height:40rpx;
    color:#000222;
    font-size:30rpx;
}

.question-hd {
    position:relative;
    height:100rpx;
    .bar {
        position:absolute;
        top:-58rpx;
        left:50%;
        transform:translateX(-50%);
        width:100%;
        height:100rpx;
        background:url(https://oss-hqwx-edu24ol.hqwx.com/miniapp/hq_training/common/headTop.png) no-repeat top center;
        background-size:cover;
    }
    .nav {
        position:relative;
        z-index:1;
        padding:24rpx 32rpx;
        border-bottom:1px solid #EEE;
        .nav-scroll {
            white-space:nowrap;
        }
        .item {
            display:inline-block;
            margin-right:32rpx;
            color:#b3b8c7;
            vertical-align:middle;
            &.on {
                color:var(--multi-tab-active-color);
            }
            &:last-child {
                margin-right:0;
            }
        }
    }
}

.question-bd {
    padding:0 32rpx;
    .item-bd {

    }
}

.list-options {
    padding:48rpx 0 0;
    //border-bottom:16rpx solid #F6F6F6;
    .item {
        position:relative;
        margin-bottom:40rpx;
        padding-left:96rpx;
        min-height:72rpx;
        line-height:72rpx;
        color:#000222;
        font-size:28rpx;
        &.option-multiple {
            .label {
                border-radius:18rpx;
            }
        }
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

.textarea {
    textarea {
        box-sizing:border-box;
        padding:16rpx;
        width:100%;
        background:#F0F0F0;
        border:1px solid #EEE;
    }
    .tips {
        color:#999;
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