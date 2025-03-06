<template>
    <view class="page-report">
        <c-navigation-bar
            style="background:transparent;"
            backType="2"
        >
        </c-navigation-bar>

        <view class="banner">
            <view class="date">{{isLoading ? '--' : report.date}} 用时:{{isLoading ? '--' : (report.usedTimeFormat || 0)}}</view>
            <view class="rate">正确率：<text>{{isLoading ? '--' : (report.correctRate || 0)}}</text></view>
        </view>

        <view class="info">
            <view class="item">
                <view class="num"><text>{{isLoading ? '--' : (report.questionNums || 0)}}</text>道</view>
                <view class="text">总题数</view>
            </view>
            <view class="item">
                <view class="num"><text>{{isLoading ? '--' : (report.rightQuestionNums || 0)}}</text>道</view>
                <view class="text">答对</view>
            </view>
            <view class="item">
                <view class="num"><text>{{isLoading ? '--' : (report.wrongQuestionNums || 0)}}</text>道</view>
                <view class="text">答错</view>
            </view>
            <view class="item">
                <view class="num"><text>{{isLoading ? '--' : (report.missQuestionNums || 0)}}</text>道</view>
                <view class="text">未答</view>
            </view>
        </view>

        <view class="list">
            <view class="hd">
                <view class="text">答题卡</view>
                <view class="more">
                    <view class="right">答对</view>
                    <view class="error">答错</view>
                    <view class="no">未答</view>
                </view>
            </view>

            <view 
                class="bd"
                v-if="questionList.length > 0"
            >
                <view 
                    class="item"
                    v-for="(item,index) in questionList"
                    :key="index"
                >
                    <view class="title">{{item.name}}</view>
                    <view class="l">
                        <view 
                            class="a"
                            :class="itemSort.className"
                            @click="goAnalysis(0,itemSort)"
                            v-for="(itemSort,itemIndex) in item.sort"
                            :key="itemIndex"
                        >
                            {{itemSort.showText}}
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <c-bottom
            isShowNav="true"
        >
            <template #content>
                <view class="btns">
                    <view 
                        class="btn"
                        @click="goList"
                    >
                        返回列表
                    </view>
                    <view 
                        class="btn1"
                        @click="goAnalysis(1)"
                    >
                        错题解析
                    </view>
                    <view 
                        class="btn2"
                        @click="goAnalysis(0)"
                    >
                        全部解析
                    </view>
                </view>
            </template>
        </c-bottom>

        <c-wechat></c-wechat>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { analysisApi, getPracticeApi } from '@/utils/api'
export default {
    data(){
        return {
            isLoading:true,
            report:'',
            questionList:[]
        }
    },
    onLoad(e){
        this.options = e
        this.examInfo = uni.getStorageSync('examInfo')//选择考试

        this.getList()
    },
    onShow(){

    },
    methods:{
        getList(){
            let list = [
                //this.getAnalysis(),
                this.getPractice()
            ]

            uni.showLoading()

            Promise.all(list).then((data)=>{
                this.isLoading = false
                uni.hideLoading()
            })
        },
        getAnalysis(){
            let params = {
                practiceId:this.options.practiceId,
                wrongFlag:0
            }

            return new Promise((resolve)=>{
                analysisApi(params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                        resolve(data)
                        console.log(999,'analysis',data)
                    }
                })
            })
        },
        getPractice(){
            let params = {
                practiceId:this.options.practiceId
            }

            return new Promise((resolve)=>{
                getPracticeApi(params).then((res)=>{
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                    resolve(data)

                    data.date = utils.timeFormat(data.startTime,'yyyy-mm-dd hh:MM')
                    data.usedTimeFormat = utils.secondsFormat(data.usedTime)

                    this.report = data
                    this.initQuestionList(data.questionGroupList)
                })
            })
        },
        initQuestionList(data){
            let list = []
            let obj = {}
            let sort = []
            let count = 1
            let page = 1
            let examId = this.examInfo.id

            data.forEach((value,index)=>{
                obj = {}
                sort = []
                obj.name = value.name
                value.practiceQuestionList.forEach((v,i)=>{
                    v.analysisDetailList.forEach((m,n)=>{
                        let className = 'miss'

                        if(m.answerState == -1){
                            className = 'error'
                        }else if(m.answerState == 1){
                            className = 'right'    
                        }

                        let text = ''
                        if(examId == 4){
                            if(count == 1){
                                text = '写'
                            }else if(count == 57){
                                text = '译'
                            }else{
                                text = count - 1   
                            }
                        }else{
                            text = count    
                        }
                        sort.push({
                            topIndex:index+1+page,
                            subIndex:n,
                            sate:m.answerState,
                            className,
                            showIndex:count,
                            showText:text
                        })  
                        count++ 
                    })
                    page++
                })   
                obj.sort = sort
                list.push(obj) 
            })
            this.questionList = list
            console.log(999,'questionList',list)
        },
        goList(){
            let path = ``
            let params = {
                mode:this.options.mode
            }

            if(this.options.mode == 3){
                path = `/packagePractise/pages/paperList/paperList?`
            }

            path += utils.paramsStringify(params)

            uni.navigateTo({
                url:path
            })
        },
        goAnalysis(type = 0,item = {}){
            let path = ``
            let params = {
                practiceId:this.options.practiceId,
                mode:this.options.mode,
                type:2,
                wrongFlag:type,
                topIndex:item.topIndex || 0,
                subIndex:item.subIndex || 0,
                paperId:this.options.paperId
            }

            path = `/packagePractise/pages/practise/practise?${utils.paramsStringify(params)}`

            console.log(999,'path',path)

            uni.navigateTo({
                url:path
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-report {
    min-height:100vh;
    background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/report/top.png") #F6F6F6 no-repeat top;
    background-size:contain;
}

.banner {
    position:relative;
    height:380rpx;
    background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/report/banner.png") no-repeat;
    background-size:contain;
    .date {
        position:absolute;
        top:192rpx;
        left:38rpx;
        padding:0 24rpx;
        height:44rpx;
        line-height:44rpx;
        background:#2EC7E5;
        border-radius:22rpx;
        color:#FFF;
        font-size:24rpx;
    }
    .rate {
        position:absolute;
        bottom:0;
        left:50%;
        transform:translateX(-50%);
        width:686rpx;
        height:120rpx;
        line-height:120rpx;
        background:#FFF;
        border-radius:24rpx;
        color:#000222;
        font-size:32rpx;
        text-align:center;
        text {
            color:#2575FF;
            font-size:48rpx;
            font-weight:500;
        }
    }
}

.info {
    display:flex;
    margin:32rpx;
    background:#FFF;
    border-radius:24rpx;
    height:168rpx;
    .item {
        flex:1;
        padding-top:40rpx;
        text-align:center;
        .num {
            position:relative;
            color:#3D4044;
            font-size:30rpx;
            text {
                color:#000222;
                font-size:40rpx;
                font-weight:500;
            }
            &:before {
                content:'';
                position:absolute;
                top:15rpx;
                right:0;
                width:1px;
                height:32rpx;
                background:#CFD3D9;
            }
        }
        .text {
            color:#90919B;
            font-size:26rpx;
        }
        &:last-child {
            .num {
                &:before {
                    display:none;
                }
            }
        }
    }
}

.list {
    position:relative;
    margin:32rpx;
    background:#FFF;
    border-radius:24rpx;
    &:before,
    &:after {
        content:' ';
        position:absolute;
        top:-48rpx;
        width:14rpx;
        height:64rpx;
        background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/report/line.png") no-repeat;
        background-size:contain;
    }
    &:before {
        left:40rpx;
    }
    &:after {
        right:40rpx;
    }
    .hd {
        position:relative;
        padding:32rpx;
        height:44rpx;
        line-height:44rpx;
        color:#000222;
        .text {
            font-size:32rpx;
            font-weight:500;
        }
        .more {
            position:absolute;
            top:50%;
            right:32rpx;
            transform:translateY(-50%);
            height:44rpx;
            view {
                position:relative;
                display:inline-block;
                margin-left:40rpx;
                padding-left:24rpx;
                vertical-align:middle;
                &:before {
                    content:'';
                    position:absolute;
                    top:50%;
                    left:0;
                    transform:translateY(-50%);
                    width:12rpx;
                    height:12rpx;
                    border-radius:50%;
                }
                &.no {
                    &:before {
                        background:#90919B;
                    }
                }
                &.error {
                    &:before {
                        background:#FF5151;
                    }
                }
                &.right {
                    &:before {
                        background:#0DD097;
                    }
                }
            }
        }
    }
    .bd {
        padding:0 32rpx;
        .item {
            margin-bottom:16rpx;
            .title {
                margin-bottom:16rpx;
                height:32rpx;
                line-height:32rpx;
                color:#000222;
                font-size:24rpx;
            }
            .l {
                .a {
                    box-sizing:border-box;
                    display:inline-block;
                    margin:0 24rpx 26rpx 0;
                    width:64rpx;
                    height:64rpx;
                    line-height:64rpx;
                    background:#FFF;
                    border:2rpx solid #E4E5EC;
                    border-radius:32rpx;
                    color:#90919B;
                    font-size:28rpx;
                    font-weight:500;
                    text-align:center;
                    vertical-align:top;
                    &.right {
                        background:#EBFFF9;
                        border-color:#EBFFF9;
                        color:#0DD097;
                    }
                    &.error {
                        background:#FFF5F5;
                        border-color:#FFF5F5;
                        color:#FF5858;
                    }
                }
            }
        }
    }
}

.btns {
    padding:32rpx 32rpx 0;
    .btn,
    .btn1,
    .btn2 {
        box-sizing:border-box;
        display:inline-block;
        height:88rpx;
        line-height:88rpx;
        border-radius:44rpx;
        font-size:24rpx;
        text-align:center;
        vertical-align:middle;
    }
    .btn {
        margin-right:16rpx;
        width:168rpx;
        background:#F1F6FF;
        color:#2575FF;
    }
    .btn1 {
        margin-right:16rpx;
        width:240rpx;
        border:2rpx solid #2575FF;
        color:#2575FF;
    }
    .btn2 {
        width:240rpx;
        background:#2575FF;
        color:#FFF;
    }
}
</style>