<template>
    <swiper class="swiper" :style="[customThemeStyle]" duration="300" @animationfinish="changeSwiper" :current="current">	
        <swiper-item v-for="(item,index) in swiperData" :key="index">
            <view class="q-top">
                <view class="q-type">{{questionType[item.qtype]}}</view>
                <view class="process"><text>{{index+1}}</text>/{{swiperData.length}}</view>
            </view>
            <view class="title">
                <rich-text :nodes="item['questionContent']" v-if="item['is_multi'] == 1"></rich-text>
                <rich-text :nodes="item['topic_list'][0]['content']" v-else></rich-text>
            </view>
            <view class="question-hd" v-if="item['is_multi'] == 1">
                <view class="bar"></view>
                <scroll-view scroll-x class="nav">
                    <view class="item" :class="{on:subCurrentIndex == subIndex}" @click="changeTimu(subIndex)" v-for="(subItem, subIndex) in item['topic_list']" :key="subIndex">
                        {{index+1}}-{{subIndex+1}}
                    </view>
                </scroll-view>
            </view>
            <view class="question-bd">
                <view v-show="subCurrentIndex == subIndex" v-for="(subItem, subIndex) in item['topic_list']" :key="subIndex">
                    <view class="title" v-if="item['is_multi'] == 1">{{subItem['content']}}</view>
                    <view class="imgs-box" v-if="subItem.imgs && subItem.imgs.length > 0">
                        <image mode="widthFix" 
                            :src="imgItem" v-for="imgItem in subItem.imgs"
                            @click="handlePreview(subIndex,subItem.imgs)"
                            :key="imgItem"></image>
                    </view>
                    <!-- qtype 题目类型 0单项选择题 1多项选择题 2不定项选择题 3判断题 4填空题 5简答题 6案例题 7论述题 -->
                    <view class="item" v-if="subItem['qtype'] <=3 ">
                        <view 
                            :class="subItem['qtype'] == 0 ? 'option' : 'option option-multiple'" 
                            @click="chooseoOption(item,subItem,v)" 
                            v-for="(v,i) in subItem['option_list']" 
                            :key="i"
                        >
                            <view 
                                class="label"
                                :class="{
                                    checked:type == 1  && checkUserChoose(subItem.id,v.seq),
                                    right:(type == 2 || type == 4) && checkUserChoose2(subItem.answer_option,v.seq),
                                    error:type == 2  && checkUserChoose3(subItem.id,v.seq,subItem.answer_option),
                                }"
                            >{{v['seq']}}</view>
                            <rich-text :class="v['contentClass']+' text'" :nodes="v['content']"></rich-text>
                        </view>
                    </view>
                    <!-- 填空题 -->
                    <view class="item blanks" v-if="subItem['qtype'] == 4">
                        <view v-for="(v,i) in subItem['option_list']" :key="i">
                            <rich-text :nodes="v['content']"></rich-text>
                            <input 
                                :disabled="type != 1" 
                                :value="answerDataObj[subItem.id] && answerDataObj[subItem.id].answer && answerDataObj[subItem.id].answer[i]" 
                                @input="input($event,subItem,i)" 
                                placeholder="输入你的答案..."
                                placeholder-style="color:#999" 
                                type="text" 
                            />
                        </view>
                    </view>
                    <!-- 简答题 --> 
                    <view class="item short-answer" v-if="item['qtype'] == 5 || ((item['qtype'] == 6 || item['qtype'] == 7) && subItem['qtype'] == 5)">
                        <textarea 
                            maxlength="500" 
                            :disabled="type != 1" 
                            :value="answerDataObj[subItem.id] && answerDataObj[subItem.id].answer && answerDataObj[subItem.id].answer[0]" 
                            @input="input($event,subItem, 0)" 
                            placeholder="输入你的答案..." 
                            placeholder-style="color:#999"
                        ></textarea>
                        <text>注：本试题为主观题，请参考解析自行评分</text>
                    </view>

                    <!-- 解析 -->
                    <!-- subItem.is_right 用户答题正确与否 0错误 1部分正确 2完全正确 3未作答 -->
                    <view class="answer-wrap" v-if="type == 2 || type == 4">
                        <view class="bar"></view>
                        <view class="answer" v-if="subItem.qtype != 4 && subItem.qtype != 5">
                            <view class="hd">答案解析</view>
                            <view class="bd">
                                <view class="right-options">正确答案：{{subItem['right_answer'] ? String(subItem['right_answer']) : subItem.answer_option}}</view>
                                <view 
                                    class="user-options" 
                                    :class="answerDataObj[subItem.id] && answerDataObj[subItem.id].is_right != undefined ? (answerDataObj[subItem.id].is_right != 2 ? 'error' : '') : ''" 
                                    v-if="type == 2"
                                >
                                    你的答案：{{getUserAnswer(subItem)}}
                                </view>
                                <view class="check" v-if="answerDataObj[subItem.id] && answerDataObj[subItem.id].is_right != undefined">
                                    {{formatIsRight(answerDataObj[subItem.id].is_right)}}
                                </view>
                            </view>
                        </view>
                        <view class="analysis">
                            <view class="hd">题目解析</view>
                            <view class="bd" v-if="analysisList[subItem.id]">
                               <view @click="handleAnalysisClick(analysisList[subItem.id].text)">{{analysisList[subItem.id].text}}</view>
                               <view v-if="analysisList[subItem.id].detailImgs && analysisList[subItem.id].detailImgs.length > 0">
                                <image mode="widthFix" 
                                    :src="dItem" v-for="(dItem, dIndex) in analysisList[subItem.id].detailImgs" 
                                    :key="dIndex"
                                    @click="handlePreview(dIndex,analysisList[subItem.id].detailImgs)"
                                    ></image>
                               </view>
                            </view>
                        </view> 
                    </view>
                </view>
            </view>
        </swiper-item>
    </swiper>
</template>

<script>
export default {
    props:{
        themeStyle:{
            type:Object,
        },
        analysisCopy:{ //是否允许复制答疑解析
            type:[Boolean],
            default(){
                return false
            }
        },
        current:{
            type:[String,Number],
            default:0
        },
        list:{
            type:Array,
            default(){
                return []
            }
        },
        // 1答题  2解析 3阅读模式，不展示解析 4阅读模式，展示解析
        type:{
            type:[String,Number],
        },
        // 回答对象组：{[topic_id]:{question_id:'',:topic_id:'',answer: ['A'],optionAnswer:'正确答案'}}
        answer:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    data(){
        return{
            swiperData:[],
            subCurrentIndex:0,
            questionBdScrollTop:0,
            questionTextDetailStr:'',
            analysisList:{},    //解析列表
            answerDataObj:{},     //答案列表
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
    watch:{
        list:{
            deep:true,
            immediate:true,
            handler(n){
                if(n.length > 0){
                    this.swiperData = n
                    this.getQuestionTextDetail(0)
                }
            }
        },
        current(n){
            this.subCurrentIndex = 0
            this.getQuestionTextDetail(n)
        },
        answer:{
            deep:true,
            handler(nv){
                this.answerDataObj = nv
            }
        },
        type(){
            if(this.swiperData.length > 0)
            this.getQuestionTextDetail(0)
        },
        themeStyle:{
            deep:true,
            immediate:true,
            handler(v){
                if(v){
                    for(let k in v){
                        this.customThemeStyle[k] && (this.customThemeStyle[k] = v[k])
                    }
                }
            }
        }
    },
    methods:{
        handleAnalysisClick(text){
            if(this.analysisCopy) {
                uni.setClipboardData({
                    data:text,
                    success:()=>{},
                    fail:(err)=>{
                        console.log('err')
                    },
                })
            }
           

        },
        // 查看图片
        handlePreview(current,urls){
            uni.previewImage({
                current:current,
                urls:urls
            });

        },
        changeSwiper(e){
            this.$emit('change',e.detail.current,0)
        },
        // 切换小题
        changeTimu(subIndex){
            if(this.subCurrentIndex == subIndex) return
            this.subCurrentIndex = subIndex
            this.getQuestionTextDetail(this.current)
            this.$emit('changeTimu',subIndex)
        },
        // 选择答案
        chooseoOption(item,subItem,v){
            if(this.type != 1) return 
            let answerItem = this.answerDataObj[subItem['id']] || {
                question_id  : subItem['q_id'],
                topic_id     : subItem['id'],
                answer       : [],
                optionAnswer : subItem['answer_option']
            }
            let ansIndex = answerItem.answer.indexOf(v.seq)

            // 单选或者判断题
            if(subItem.qtype == 0 || subItem.qtype == 3){
                answerItem.answer = ansIndex > -1 ? [] : [v.seq]
                if(ansIndex > -1){
                    // 取消选择
                    delete this.answerDataObj[subItem.id]
                }else{
                    this.$set(this.answerDataObj,subItem.id,answerItem)
                }
                // 下一题
                if(answerItem.answer.length > 0){
                    this.next()
                }
            }else{
                if(ansIndex > -1){
                    // 取消选择
                    answerItem.answer.splice(ansIndex,1)
                }else{
                    answerItem.answer.push(v.seq)
                }
                if(answerItem.answer.length == 0){
                    delete this.answerDataObj[subItem.id]
                }else{
                    this.$set(this.answerDataObj,subItem.id,answerItem)
                }
            }
            this.$emit('answer',this.answerDataObj)
        },
        // 问答/简答
        input(e,subItem,i){
            if(this.timer){
                clearTimeout(this.timer)
                this.timer = null
            }
            this.timer = setTimeout(()=>{
                let answerItem = this.answerDataObj[subItem['id']] || {
                    question_id  : subItem['q_id'],
                    topic_id     : subItem['id'],
                    answer       : [],
                    optionAnswer : subItem['answer_option']
                }
                answerItem.answer[i] = e.detail.value
                this.$set(this.answerDataObj,subItem.id,answerItem)
                this.$emit('answer',this.answerDataObj)
            },300)
        },
        // 获取答案解析
        getQuestionTextDetail(index){
            if(this.type != 2 && this.type != 4) return 
            let subItem = this.swiperData[index]['topic_list'][this.subCurrentIndex]
            if(this.analysisList[subItem.id]) return;
			let _url = subItem['analysis_text'] || ''
            if(!_url){
                this.$set(this.analysisList,subItem.id,{text:'此题暂无解析！'})
				return
			}
			_url = this.$hq.utils.replaceOss(_url);
            this.$set(this.analysisList,subItem.id,{text:'题目解析正在加载中'})
            this.$hq.get(_url).then(res=>{
                let str = res.data.replace(/.+?\,(.+).+/gi,'$1').replace(/\"|\'/g,'') 
                let detailImgs = []
                let imgs  = []
                imgs = str.match(/src=\&quot\;(.+?)\;/g) || []
                if(imgs.length > 0){
                    imgs.forEach((v,i) => {
                        let imgUrl = this.$hq.utils.delHTMLMark(v).replace(/(\\|\")/g,"").replace("src=","")
                        imgUrl = this.$hq.utils.replaceOss(imgUrl)
                        detailImgs.push(imgUrl)
                    })
                }
                this.$set(this.analysisList,subItem.id,{text:this.$hq.utils.delHTMLMark(str),detailImgs})
            })
		},
        checkUserChoose(id,seq){
            if(this.answerDataObj[id] && this.answerDataObj[id].answer.indexOf(seq) > -1) return true
            return false
        },
        checkUserChoose2(answer_option,seq){
            if(answer_option.indexOf(seq) > -1) return true
            return false
        },
        checkUserChoose3(id,seq,answer_option){
            if(this.answerDataObj[id] && this.answerDataObj[id].answer.indexOf(seq) > -1 && answer_option.indexOf(seq) == -1) return true
            return false
        },
        formatIsRight(v){
            // is_right 用户答题正确与否 0错误 1部分正确 2完全正确 3未作答
            if(v < 2) return '回答错误'
            if(v == 2) return '回答正确'
            if(v == 3) return ''
        },
        getUserAnswer(subItem){
            return this.answerDataObj[subItem.id] ? String(this.answerDataObj[subItem.id].answer) || '未作答' : '未作答'
        },
        next(){
            let item = this.swiperData[this.current]
            if((item.qtype == 6 || item.qtype == 7) && item.is_multi == 1 && this.subCurrentIndex < item.topic_list.length-1){
                this.subCurrentIndex++
                this.$nextTick(()=>{
                    this.$emit('change',this.current,this.subCurrentIndex)
                })
            }else  if(this.current < this.swiperData.length-1){
                this.$nextTick(()=>{
                    this.$emit('change',this.current + 1,0)
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.swiper,swiper-item{
    height: 100%;
}
swiper-item{
    overflow-y: auto;
}
.q-top{
    display: flex;
    padding: 32rpx 32rpx 24rpx;
    justify-content: space-between;
    align-items:center;
    .q-type{
        height: 50rpx;
        background: #F5F5F5;
        border-radius: 4rpx;
        line-height: 50rpx;
        padding: 0 14rpx;
        font-size: 24rpx;
        color: #999999;
    }
    .process{
        font-size: 28rpx;
        color: #ADB0B6;
        line-height: 32rpx;
        text{
            color: var(--process-color);
        }
    }
}
.title {
    padding:0 32rpx;
    margin-bottom: 32rpx;
    line-height:44rpx;
    color:#363C51;
    font-size:30rpx;
    font-weight:600;
    text-align:justify;
    /deep/ img {
        width: 100%;
    }
} 
.question-hd {
    position:relative;
    width:100%;
    background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/hq_training/common/headTop.png') no-repeat center top / 100% auto;
    .bar {
        height:70rpx;
        overflow:hidden;
        margin-bottom: 8rpx;
    }
    .nav {
        z-index:2;
        height:60rpx;
        line-height:60rpx;
        overflow-x: auto;
        white-space: nowrap;
        .item {
            display: inline-block;
            margin:0 20rpx;
            color:#B3B8C7;
            font-size:26rpx;
            vertical-align:middle;
            &.on {
                color:var(--multi-tab-active-color);
            }
        }
    }
}
.question-bd {
    .title {
        padding-top: 40rpx;
        color:#363C51;
        line-height:44rpx;
        font-size:30rpx;
    }
}
.item {
    padding: 0 32rpx;
    margin:0 0 50rpx;
    .option {
        position:relative;
        margin-bottom:20rpx;
        padding:15rpx 30rpx 15rpx 100rpx;
        min-height:72rpx;
        .label {
            display:inline-block;
            box-sizing:border-box;
            position:absolute;
            top:50%;
            left:0;
            transform:translateY(-50%);
            width:72rpx;
            min-height:72rpx;
            line-height:72rpx;
            background:#F4F5F8;
            border-radius:50rpx;
            color:#363C51;
            font-size:24rpx;
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
            height:72rpx;
            line-height:72rpx;
            color:#363C51;
            font-size:28rpx;
            font-weight:500;
            &.more {
                line-height:36rpx;
            }
            /deep/ img {
                width: 100%;
            }
        }
        &.option-multiple {
            .label {
                border-radius:16rpx;
            } 
        }
    }
}
.blanks{
	font-size: 28rpx;
	margin-top: 40rpx;
	input{
		display: block;
		width: 653rpx;
		padding-left: 33rpx;
		height: 98rpx;
		background: #F2F4F5;
		border-radius: 6rpx;
		margin: 33rpx 0 50rpx 0;
		font-size: 26rpx;
	}
}
.short-answer{
	text{ 
		font-size: 24rpx; 
		margin-top: 23rpx;
		color: #999;
	}
	textarea{
		padding: 30rpx;
		width: 630rpx;
		height: 180rpx;
		background: #F2F4F5;
		border: 1rpx solid #E5E5E5;
		border-radius: 10rpx;
		font-size: 26rpx;
	}
}
.answer-wrap{
    .bar{
        width: 100vw;
        height: 24rpx;
        background: #F5F5F5;
        margin-bottom: 40rpx;
    }
}
.answer,.analysis {
    padding: 0 32rpx 40rpx;
    margin-bottom: 40rpx;
    border-bottom:2rpx solid #EBECEE;
    .hd {
        margin-bottom:24rpx;
        font-size: 30rpx;
        font-weight: bold;
        color: #010B16;
        line-height: 30rpx;
    }
    .bd {
        line-height: 28rpx;
        font-size:28rpx;
        overflow:hidden;
        display: flex;
        .right-options {
            color: #4BCD8A;
        }
        .user-options {
            flex:1;
            margin-left: 40rpx;
            color:#5074FF;
            &.right{
                color:#4BC083;
            }
            &.error{
                color:#F7534C;
            }       
        }
        .check{
            color:#ADB0B6;
            font-size: 28rpx;
            font-weight: 500;
        }
    }
    image{
        width: 100%;
    }
}
.analysis {
    margin-bottom: 0;
    border-bottom:none;
    .bd {
        display: block;
        font-size: 28pxr;
        color: #999999;
        line-height: 40rpx;
    }
}
.imgs-box{
    padding:0 32rpx;
    margin-bottom: 32rpx;
    image{
        width: 100%;
    }
}
</style>å