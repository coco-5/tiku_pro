<template>
    <view class="page-index">
        <c-navigation-bar
            style="background:linear-gradient(180deg, #E0ECFF 0%, rgba(255,255,255,0.9) 100%);"
        >
            <template #left>
                <view 
                    class="exam"
                    @click="goExam"
                >
                    {{examInfo.name || ''}}
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

        <tiku
            :examInfo="examInfo"
            v-if="examInfo"
        >
        </tiku>

        <chapter
            :examInfo="examInfo"
            v-if="examInfo"
        >
        </chapter>

        <paper></paper>

        <c-bottom
            :current="0"
            :isShowNav="true"
        >
        </c-bottom>

    </view>
</template>

<script>
import utils from '@/utils/utils'
import chapter from './module/chapter.vue'
import tiku from './module/tiku.vue'
import paper from './module/paper.vue'
export default {
    components: { chapter, tiku, paper },
    data(){
        return{
            options:'',
            examInfo:'',//用户当前选择的考试{gid,gname} 
            subjectList:[],//科目列表
            subjectIndex:0,//当前选择的科目
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){
        this.matchExamInfo()

        this.getSubjectList()
    },
	methods:{
        matchExamInfo(){
            let examInfo = {}

            /* if(this.options.examId){
                examInfo = {
                    id:this.options.examId,
                    name:''
                }
            }else if(uni.getStorageSync('examInfo')){
                examInfo = uni.getStorageSync('examInfo')
            }else{
                this.goExam()
            } */

            examInfo = {
                id:5594,
                name:'国家公务员'
            }
            uni.setStorageSync('examInfo',examInfo)

            this.examInfo = examInfo
        },
        getSubjectList(){
            this.subjectList = ['中经','初会','教资','高经','一造','消费设施操作员','中经','初会','教资','高经','一造','消费设施操作员']
        },
        changeSubject(index){
            this.subjectIndex = index
        },
        goExam(){
            return
            uni.navigateTo({
                url:'/packageExam/pages/subject/subject'
            })
        },
        moreSubject(){
            uni.navigateTo({
                url:'/packageExam/pages/subject/subject'
            })
        }
    }
}
</script>

<style lang="scss">
.page-index{
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