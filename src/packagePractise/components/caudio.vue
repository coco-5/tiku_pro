<template>
    <div 
        class="audio-wrap"
    >
        <div 
            class="audio-btn"
            :class="playing ? 'play' : ''"
            @click="play"
        ></div>

        <div class="progress">
            <span>{{currentTime}}</span>
            <span class="p">
                <progress
                    backgroundColor="#FFF"
                    activeColor="#2575FF"
                    border-radius="3"
                    :percent="percentage"
                />
            </span>
            <span v-if="audioDuration">{{audioDuration}}</span>
        </div>
    </div>
</template>

<script>
import utils from '@/utils/utils'
export default{
    props:{
        path:{
            type:String
        }
    },
    watch:{
        path:{
            deep:true,
            handler(n){}
        }
    },
    data(){
        return {
            playing:false,
            audioDuration:'',
            getDuration:false,
            percentage:0,
            currentTime:0
        }
    },
    mounted(){
        this.$nextTick(()=>{
            if(this.path){
                this.audioCtx = uni.createInnerAudioContext()

                this.audioCtx.src = this.path
                this.percentage = 0
                this.currentTime = utils.audioDurationFormat(this.audioCtx.duration)

                this.audioCtx.onPlay(()=>{
                    this.playing = true     
                })

                this.audioCtx.onPause(()=>{
                    this.playing = false     
                })
 
                this.audioCtx.onError((res)=>{ 
                })

                this.audioCtx.onEnded((e)=>{
                    this.percentage = 100
                    setTimeout(()=>{
                        this.playing = false
                        this.percentage = 0
                        this.currentTime = utils.audioDurationFormat(Math.floor(0))
                        this.audioCtx.offTimeUpdate(listener)
                    }, 1500)
                })

                this.audioCtx.onTimeUpdate(()=>{
                    if(!this.getDuration){
                        this.audioDuration = utils.audioDurationFormat(Math.floor(this.audioCtx.duration))
                        this.getDuration = true
                    }

                    this.currentTime = utils.audioDurationFormat(Math.floor(this.audioCtx.currentTime))

                    let current = Math.round(this.audioCtx.currentTime * 10)
                    let duration = Math.round(this.audioCtx.duration * 10)
                    let percentage = Math.ceil((current / duration) * 100)
                    this.percentage = percentage
                })
            }
        })
    },
    destroyed(){
        this.audioCtx.destroy()
    },
    methods:{
        play(){
            if(!this.playing){
                this.audioCtx.play()
            }else{
                this.audioCtx.pause()      
            }
            
        }    
    }
}
</script>

<style lang="scss" scoped>
.audio-wrap {
    padding:20rpx;
    height:40rpx;
    line-height:40rpx;
    background:#F2F9FF;
    border-radius:40rpx;
    color:#2575FF;
    .audio-btn {
        position:relative;
        display:inline-block;
        margin-right:16rpx;
        width:40rpx;
        height:40rpx;  
        background:#2575FF;
        border-radius:20rpx;
        text-align:center;
        vertical-align:top;
        &:before {
            content:' ';
            position:absolute;
            top:50%;
            left:72%;
            transform:translate(-50%,-50%);
            width:0;
            height:0;
            border-top:10rpx solid transparent;
            border-left:12rpx solid #FFF;
            border-bottom:10rpx solid transparent;
            border-right:12rpx solid transparent;
        }
        &.play {
            &:before {
                left:50%;
                border:0 none;
                width:14rpx;
                height:14rpx;
                background:#FFF;
            }
        }
    }
    .progress {
        display:inline-block;
        width:500rpx;
        height:40rpx;
        font-size:24rpx;
        vertical-align:top;
        span {
            display:inline-block;
            margin:0 8rpx;
            width:60rpx;
            vertical-align:middle;
        }
        .p {
            width:330rpx;
        }
    }
}
</style>