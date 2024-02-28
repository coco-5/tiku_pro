<template>
    <view class="page-index">
        <c-navigation-bar
            style="background:linear-gradient(180deg, #E0ECFF 0%, rgba(255,255,255,0.9) 100%);"
        >
            <template #left>
                <view 
                    class="exam"
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
        </c-navigation-bar>
        
        <c-tab
            :list="subjectList"
            :current="subjectIndex"
            @change="changeSubject"
            @more="moreSubject"
        >
        </c-tab>

        <!-- <tiku
            :examInfo="examInfo"
            v-if="examInfo"
        >
        </tiku>

        <chapter
            :examInfo="examInfo"
            v-if="examInfo"
        >
        </chapter> -->

        <paper
            :options="options"
            :subjectInfo="subjectInfo"
            v-if="examInfo && subjectInfo"
        >
        </paper>

        <c-bottom
            :current="0"
            :isShowNav="true"
        >
        </c-bottom>

    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getExamListApi } from '@/utils/api'
import chapter from './module/chapter.vue'
import tiku from './module/tiku.vue'
import paper from './module/paper.vue'
export default {
    components: { chapter, tiku, paper },
    data(){
        return{
            options:{},
            examInfo:{},//用户当前选择的考试{gid,gname} 
            subjectInfo:{},//用户当前选择的科目{gid,gname}
            subjectList:[],//科目列表
            subjectIndex:0,//当前选择的科目
            examTitleList:[],//考试选择器列表
            examIndex:0,//考试选择器索引
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){
        this.getExamList().then(()=>{
            this.matchExamInfo()
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
                        resolve()
                    }
                })
            })
        },
        matchExamInfo(){
            let examInfo = {}
            let examId = 0

            if(this.options.examId || uni.getStorageSync('examInfo')){
                examId = this.options.examId || uni.getStorageSync('examInfo').id
                
                for(let i=0;i<this.examList.length;i++){
                    if(this.examList[i].examId == examId){
                        let data = this.examList[i]
                        examInfo = {
                            id:data.examId,
                            name:data.examTitle
                        }
                        this.examIndex = i
                        break
                    }
                }
            }else{
                let data = this.examList[0]
                examInfo = {
                    id:data.examId,
                    name:data.examTitle
                }
            }
            this.examInfo = examInfo
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
        changeSubject(index){
            this.subjectIndex = index
            let subject = this.subjectList[index]

            this.setSubjectInfo(subject)
        },
        setSubjectInfo(data){
            this.subjectInfo = {
                id:data.subjectId,
                name:data.subjectTitle
            }
            console.log(999,'subjectInfo',12112,this.subjectInfo)
            uni.setStorageSync('subjectInfo',this.subjectInfo)
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
        moreSubject(){
            uni.navigateTo({
                url:'/packageExam/pages/subject/subject'
            })
        }
    },
    onShareAppMessage(e){
        return {
            title:'送您你一个刷题神器，快来一起刷题吧！',
            path:'/pages/index/index',
            imageUrl:''
        }
    }
}
</script>

<style lang="scss">
.page-index{
    min-height:100vh;
    background:#F6F6F6;
}

.navigation-bar {
    .exam {
        position:relative;
        margin-left:25rpx;
        padding-right:24rpx;
        color:#000222;
        font-size:36rpx;
        font-weight:500;
        &:before {
            content:' ';
            position:absolute;
            top:50%;
            right:0;
            transform:translateY(-50%);
            width:0;
            height:0;
            border-left:8rpx solid #000222;
            border-top:8rpx solid transparent;
            border-bottom:8rpx solid transparent;
        }
    }
}
</style>