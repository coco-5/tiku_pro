<template>
    <view class="box-answer">
        <rich-text 
            class="item-title" 
            :nodes="detail.showContent"
            v-if="quType == 5"
        >
        </rich-text>
        
        <template v-if="detail.quType == 4">
            <view class="textarea">
                <textarea 
                    maxlength="500" 
                    :disabled="options.type != 1" 
                    :value="detail.answerContent" 
                    @input="input($event,detail)" 
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
                    :class="detail.quType == 2 ? '' : 'option-multiple'"
                    @click="chooseOption(detail,itemAnswer)"
                    v-for="(itemAnswer,indexAnswer) in detail.answerList"
                    :key="indexAnswer"
                >
                    <view 
                        class="label"
                        :class="{
                            'checked':options.type == 1 && checkUserChoose(detail.id,itemAnswer.seq),
                            'right':options.type == 2 && checkUserChoose2(detail.answerOption,itemAnswer.seq),
                            'error':options.type == 2  && checkUserChoose3(detail.id,itemAnswer.seq,detail.answerOption),
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
                
        <view 
            class="mod-answer"
            v-if="options.type == 2 && detail.quType != 4"
        >
            <view class="hd">答案解析</view>
            <view class="bd">
                <view class="a">正确答案：{{detail.answerOption || ''}}</view>
                <view class="b">你的答案：{{detail.answerOption}}</view>
                <view class="c">{{detail.answerState == 0 ? '未回答' : (detail.answerState == -1 ? '回答错误' : '回答正确')}}</view>
            </view>
        </view>
                
        <view 
            class="mod-analysis"
            v-if="options.type == 2"
        >
            <view class="hd">题目解析</view>
            <view class="bd">
                <rich-text :nodes="detail.showAnalysis"></rich-text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        options:{
            type:Object
        },
        quType:{
            type:[String,Number]
        },
        detail:{
            type:Object
        },
        answerDataObj:{
            type:Object
        }
    },
    watch:{
        detail:{
            deep:true,
            handler(n){}
        },
        quType:{
            deep:true,
            handler(n){}
        },
        answerDataObj:{
            deep:true,
            handler(n){}
        }
    },
    mounted(){
    },
    methods:{
        // 问答/简答
        input(e,detail){
            if(this.options.type != 1) return

            this.$emit('input',e, detail)
        },
        chooseOption(detail,itemAnswer){
            if(this.options.type != 1) return 
            this.$emit('choose',detail,itemAnswer)
        },
        checkUserChoose(id,seq){
            if(this.answerDataObj && this.answerDataObj[id] && this.answerDataObj[id].seq.indexOf(seq) > -1) return true
            return false  
        },
        checkUserChoose2(answerOption,seq){
            if(answerOption){
                if(answerOption.indexOf(seq) > -1) return true
            } 
            return false
        },
        checkUserChoose3(id,seq,answerOption){
            if(this.answerDataObj[id] && this.answerDataObj[id].answer && this.answerDataObj[id].answer.indexOf(seq) > -1 && answerOption.indexOf(seq) == -1) return true
            return false
        },
    }
}
</script>

<style lang="scss" scoped>
.box-answer {
    box-sizing:border-box;
    padding-top:24rpx;
    height:100%;
    overflow-y:auto;
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
    padding:40rpx 0;
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
        text-align:justify; 
    }
}
</style>