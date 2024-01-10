<template>
    <view class="page-list">
        <c-navigation-bar
            title="历年真题"
            backType="1"
        >
        </c-navigation-bar>
        
        <c-tab
            :list="subjectList"
            :current="subjectIndex"
            @change="changeSubject"
        >
        </c-tab>

        <view class="list">
            <view 
                class="item"
                v-for="(item,index) in paperList"
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
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getExamListApi, getPaperBySubjectIdApi } from '@/utils/api'
export default {
    data(){
        return {
            options:'',
            subjectList:[],//科目列表
            subjectIndex:0,//当前选择的科目
            paperList:[]
        }
    },
    onLoad(e){
        this.options = e

        if(!this.options.subjectId){
            this.options.subjectId = uni.getStorageSync('subjectInfo').id || 0
        }
    },
    onShow(){
        this.getExamList().then(()=>{
            this.getPaper()
        })
    },
    methods:{
        getExamList(){
            return new Promise((resolve,reject)=>{
                getExamListApi().then(res=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).examList
                        this.examList = data

                        this.matchSubject()
                        resolve()
                    }
                })
            })
        },
        matchSubject(){
            if(uni.getStorageSync('examInfo').id){
                this.options.examId = uni.getStorageSync('examInfo').id
            }
            if(uni.getStorageSync('subjectInfo').id){
                this.options.subjectId = uni.getStorageSync('subjectInfo').id
            }

            this.examList.forEach((item,index)=>{
                if(item.examId == this.options.examId){
                    this.subjectList = item.subjectList
                    item.subjectList.forEach((subjectItem,subjectIndex)=>{
                        if(subjectItem.subjectId == this.options.subjectId){
                            this.subjectIndex = subjectIndex
                        }
                    })
                }
            })
        },
        getPaper(){
            let params = {
                subjectId:this.subjectList[this.subjectIndex].subjectId,
                type:this.options.paperType || 1,
                pageSize:10,
                pageNum:1
            }
        
            getPaperBySubjectIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).paperDTOList

                    this.paperList = data
                }
            })    
        },
        goPractise(item){
            let params = {
                paperId:item.id
            }
            uni.navigateTo({
                url : `/packagePractise/pages/paperDetail/paperDetail?${this.$hq.utils.paramsStringify(params)}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-list {
    min-height:100vh;
    background:#F6F6F6;
    .list {
        padding:32rpx;
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
}
</style>