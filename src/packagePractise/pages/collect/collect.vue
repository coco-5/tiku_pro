<template>
    <view class="page">
        <view class="list">

        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
import { getListCollectionApi } from '@/utils/api'
export default {
    data(){
        return{
            list:[]
        }
    },
    mounted(){
        this.getListCollection()
    },
    methods:{
        getListCollection(){
            getListCollectionApi().then((res)=>{
                if(res.data.code == 0){
                    let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                    this.list = data.questionCollections || []
                    console.log(999,'data',data)
                }
            })    
        }     
    }
}
</script>

<style lang="scss" scoped>
.page {

}
</style>