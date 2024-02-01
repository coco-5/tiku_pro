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

        <view 
            class="list"
            v-if="paperList.length > 0"
        >
            <c-paper-list
                :mode="options.mode"
                :list="paperList"
                listStyle="padding:32rpx;"
            ></c-paper-list>
        </view>

        <template v-else>
            <c-no-content></c-no-content>
        </template>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getExamListApi, getPaperBySubjectIdApi } from '@/utils/api'
export default {
    data(){
        return {
            options:{},
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
                type:this.options.mode || 1,
                pageSize:10,
                pageNum:1
            }
        
            getPaperBySubjectIdApi(params).then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).paperDTOList || []

                    this.paperList = data
                }
            })    
        },
        changeSubject(index){ 
            this.subjectIndex = index
            this.getPaper()
        }
    },
    onShareAppMessage(e){
        return {
            title:'送您你一个刷题神器，快来一起刷题吧！',
            path:'',
            imageUrl:''
        }
    }
}
</script>

<style lang="scss" scoped>
.page-list {
    min-height:100vh;
    background:#F6F6F6;
}
</style>