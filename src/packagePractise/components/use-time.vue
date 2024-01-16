<template>
    <view class="mod-time">
        <text class="icon-time"></text>
        <text class="text">{{useTime}}</text>
    </view>
</template>

<script>
export default {
    props:{
        options:{
            type:Object
        },
        time:{
            type:[Number,String]
        }
    },
    watch:{
        options:{
            deep:true,
            handler(n){
                
            }
        },
        time:{
            deep:true,
            handler(n){
                this.processingTime()
            }
        }
    },
    data(){
        return {
            useTime:'00:00:00'
        }
    },
    created(){
    },
    destroyed(){
        if(this.countDownTimer){
            clearInterval(this.countDownTimer)
        }     
    },
    methods:{
        processingTime(){
            if(this.options.state == 1){
                this.useTimeCountDown()
            }else if(this.options.state == 2){
                this.setCountDown()
            }
        },
        // 倒计时
        setCountDown(){
            let second = Number(this.time || 0) * 60

            this.countDownTimer = setInterval(() => {
                second--
                if(second < 0 ){
                    second = 0
                }
                let h = this.format(parseInt(second / (60*60)))
                let m = this.format(parseInt(second % (60*60) / 60))
                let s = this.format(parseInt(second % (60*60) % 60))
                this.useTime = `${h}:${m}:${s}`
                if(second == 0){
                    clearInterval(this.countDownTimer)
                    this.countDownTimer = null
                }
            }, 1000)
        },
        useTimeCountDown(){
            let second = 0

            this.countDownTimer = setInterval(()=>{
                second++
                let h = this.format(parseInt(second / (60*60)))
                let m = this.format(parseInt(second % (60*60) / 60))
                let s = this.format(parseInt(second % (60*60) % 60))
                this.useTime = `${h}:${m}:${s}`
            },1000)    
        },
        format(v){
            return v >= 10 ? v : '0' + v
        },
    }
}
</script>

<style lang="scss" scoped>
.mod-time {
    text-align:center;
    font-size:28rpx;
    line-height:29rpx;
    color:#010B16;
    .icon-time { 
        display:inline-block; 
        margin:0 auto; 
        width:44rpx; 
        height:44rpx; 
        background:url(https://oss-hqwx-edu24ol.hqwx.com/miniapp/tiku_pro/icon_time2.png) no-repeat; 
        background-size:100%; 
        vertical-align:middle;
    }
    .text {
        display:inline-block;
        vertical-align:middle;
    }
}
</style>