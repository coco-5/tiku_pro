<template>
    <swiper 
        class="swiper" 
        :style="[customThemeStyle]" 
        duration="300" 
        @animationfinish="changeSwiper" 
        :current="index"
    >	
        <swiper-item 
            v-for="(item,index) in list" 
            :key="index"
        >
            <view 
                class="swiper-desc"
                v-if="item.groupIsDesc == 1"
            >
                <view class="name">{{item.name}}</view>
                <view class="desc">
                    <rich-text 
                        :nodes="item.description"
                    ></rich-text>
                </view>
            </view>
            <view 
                class="swiper-page"
                :class="(item.quType == 5 ? 'swiper-anli' : '') + (isShowQuestion ? '' : ' hide-question')"
                v-else
            >
                <view class="q-top">
                    <view class="q-type">{{item.quTypeDesc || questionType[item.quType]}}</view>
                    <!-- <view class="process">
                        <block v-if="item.isSpecial == 1">
                            {{item.showText}}
                        </block>
                        <block v-else>
                            <text>{{showIndex}}</text>/{{questionCount}}
                        </block>
                    </view> -->
                </view>

                <view class="title">
                    <template v-if="item.audioPath">
                        <caudio
                            :audioPath="item.audioPath"
                        ></caudio>
                    </template>
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
                                :class="subIndex == indexDetail ? 'on' : ''"
                                @click="changeSubIndex(indexDetail)"
                                v-for="(itemDetail,indexDetail) in item.questionDetailList"
                                :key="indexDetail"
                            >
                                {{itemDetail.showText}}题
                            </view>
                        </scroll-view>
                    </view>
                </view> 

                <view class="question-bd">
                    <template v-if="item.quType == 5">
                        <swiper
                            class="bd-swiper"
                            duration="300" 
                            @animationfinish="changesubSwiper" 
                            :current="subIndex"
                        >
                            <swiper-item
                                class="bd-item"
                                v-for="(itemDetail,indexDetail) in item.questionDetailList"
                                :key="indexDetail" 
                            >
                                <answer
                                    :quType="item.quType"
                                    :options="options"
                                    :detail="itemDetail"
                                    :answerDataObj="answerDataObj"
                                    @input="input"
                                    @choose="chooseOption"
                                ></answer>
                            </swiper-item>
                        </swiper>
                    </template>
                    <template v-else>
                        <view
                            class="bd-item"
                            v-for="(itemDetail,indexDetail) in item.questionDetailList"
                            :key="indexDetail" 
                        >
                            <answer
                                :quType="item.quType"
                                :options="options"
                                :detail="itemDetail"
                                :answerDataObj="answerDataObj"
                                @input="input"
                                @choose="chooseOption"
                            ></answer>
                        </view>
                    </template>
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
import answer from './answer.vue'
import caudio from './caudio.vue'
export default {
  components: { answer, caudio },
    props:{
        options:{
            type:Object
        },
        list:{
            type:Array,
            default:[]
        },
        index:{
            type:[String,Number],
            default:0
        },
        subIndex:{
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
                if(n){
                    this.setCount()
                    this.setShowIndex()
                }    
            }
        },
        index:{
            deep:true,
            handler(n){
                this.isShowQuestion = true

                this.setShowIndex()
            }
        },
        subIndex:{
            deep:true,
            handler(n){
            }
        },
        answerDataObj:{
            deep:true,
            handler(n){}
        }
    },
    data(){
        return {
            questionCount:0,
            showIndex:0,
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
            isShowQuestion:true,
            questionStyle:''
        }
    },
    mounted(){
        this.initStyle()
    },
    methods:{
        initStyle(){
        },
        setCount(){
            let count = 0
            this.list.forEach(item=>{
                if(!item.groupIsDesc){
                    item.questionDetailList.forEach((itemDetail)=>{
                        count++
                    })
                }
            })
            this.questionCount = count
        },
        setShowIndex(){ 
            if(!this.list[this.index].groupIsDesc){
                this.showIndex = this.list[this.index].questionDetailList[0].showText
            }
        },
        changeSwiper(e){
            this.$emit('change',e.detail.current,this.subIndex)
        },
        changesubSwiper(e){
            this.$emit('change',this.index, e.detail.current)
        },
        changeSubIndex(index){
            this.$emit('change',this.index, index)
        },
        // 问答/简答
        input(e,itemDetail){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            this.timer = setTimeout(()=>{
                let answerItem = {
                    questionId : itemDetail.id,
                    seq : [],
                    answer : e.detail.value
                }

                this.$set(this.answerDataObj,itemDetail.id,answerItem)
                this.$emit('answer',this.answerDataObj,itemDetail.id)
            },300)
        },
        // 选择答案
        chooseOption(itemDetail,itemAnswer){

            let answerItem = this.answerDataObj[itemDetail.id] || {
                questionId : itemDetail.id,
                seq : [],
                answer : ''
            }
            let ansIndex = answerItem.seq.indexOf(itemAnswer.seq)

            // 单选或者判断题
            if(itemDetail.quType == 1 || itemDetail.quType == 2){
                answerItem.seq = ansIndex > -1 ? [] : [itemAnswer.seq]
                if(ansIndex > -1){
                    // 取消选择
                    delete this.answerDataObj[itemDetail.id]
                }else{
                    this.$set(this.answerDataObj,itemDetail.id,answerItem)
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
                    delete this.answerDataObj[itemDetail.id]
                }else{
                    this.$set(this.answerDataObj,itemDetail.id,answerItem)
                }
            }
            this.$emit('answer',this.answerDataObj,itemDetail.id)
        },
        next(){
            let item = this.list[this.index]

            if(item.quType != 5){
                this.$emit('change',this.index+1,0)
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
        .question-bd {
            height:calc(100% - 104rpx - 40% - 64rpx - 100rpx);
        }
        .bd-item {
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
    text-align:justify;
}

::v-deep p {
        font-size:100rpx;
        margin-bottom:24rpx;
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
    .bd-swiper {
        height:100%;
    }
    .item-bd {

    }
}

.swiper-desc {
    min-height:100vh;
    background:#F9F9F9;
    .name {
        margin-bottom:32rpx;
        padding-top:40rpx;
        color:#333;
        font-size:48rpx;
        font-weight:500;
        text-align:center;
    }
    .desc {
        margin:0 40rpx;
        font-size:30rpx;
        color:#999;
    }
}
</style>