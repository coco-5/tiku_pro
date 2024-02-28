<template>
    <view 
        class="exam"
        :style="style"
    >
        <picker 
            :range="examTitleList"
            :value="examIndex"
            @change="changeExam"
        >
            <view class="picker-text">
                {{examTitleList[examIndex] || ''}}
            </view>
        </picker>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getExamListApi } from '@/utils/api'
export default{
    props:{
        style:{
            type:String
        }
    },
    data(){
        return {
            examInfo:{},
            subjectInfo:{},
            examTitleList:[],//考试选择器列表
            examIndex:0,//考试选择器索引
        }
    },
    mounted(){
        this.subjectInfo = uni.getStorageSync('subjectInfo')
        this.examInfo = uni.getStorageSync('subjectInfo')

        this.getExamList(()=>{
            
        })
    },
    methods:{
        getExamList(){
            let examTitleList = []
            let examIdList = []

            return new Promise((resolve,reject)=>{
                getExamListApi().then(res=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).examList
                        data.forEach((item,index)=>{
                            examTitleList.push(item.examTitle)
                            examIdList.push(item.examId)
                        })

                        this.examTitleList = examTitleList
                        this.examIdList = examIdList
                        this.examList = data
                        console.log(999,'examTitleList',examTitleList)
                        console.log(999,'examIdList',examIdList)
                        console.log(999,'examList',this.examList)
                        resolve()
                    }
                })
            })
        },
        changeExam(e){
            let value = e.detail.value
            this.examIndex = value

            for(let i=0; i<this.examList.length; i++){
                if(i == value){
                    let data = this.examList[i]
                    this.examInfo = {
                        id:data.examId,
                        name:data.examTitle
                    }
                    break
                }
            }
            uni.setStorageSync('examInfo',this.examInfo)
            this.getSubjectList()
        },
        getSubjectList(){
            let data = this.examList

            for(let i=0;i<data.length;i++){
                if(this.examInfo.id == data[i].examId){
                    this.subjectList = data[i].subjectList
                    break
                }
            }

            let subject = this.subjectList[0]
            this.setSubjectInfo(subject)
        },
        setSubjectInfo(data){
            this.subjectInfo = {
                id:data.subjectId,
                name:data.subjectTitle
            }
            uni.setStorageSync('subjectInfo',this.subjectInfo)
        },
    }
}
</script>

<style lang="scss" scoped>
.exam {
    display:inline-block;
    vertical-align:middle;
}
</style>