<template>
    <view class="page-exam">

    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getExamListApi } from '@/utils/api'
export default {
    data(){
        return {

        }
    },
    onLoad(e){
        this.options = e

        this.getExamList()
    },
    onShow(){

    },
    methods:{
        getExamList(){
            getExamListApi().then(res=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam)).examList

                    this.examInfo = {
                        id:data[0].examId,
                        name:data[0].examTitle
                    }
                    uni.setStorageSync('examInfo',this.examInfo)

                    this.goIndex()
                }
            })
        },
        goIndex(){
            uni.redirectTo({
                url:'/pages/index/index'
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-exam {
    
}
</style>