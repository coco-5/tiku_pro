<template>
    <div class="audio-wrap">
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
        audioPath:{
            type:String
        }
    },
    watch:{
        audioPath:{
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
            if(this.audioPath){
                this.audioCtx = uni.createInnerAudioContext()

                this.audioCtx.src = this.audioPath
                this.percentage = 0
                this.currentTime = utils.audioDurationFormat(this.audioCtx.duration)

                this.audioCtx.onPlay(()=>{
                    console.log(999,'onPlay',this.audioCtx.onTimeUpdate)
                    this.playing = true     
                })

                this.audioCtx.onEnded((e)=>{
                    console.log(999,'onEnded')
                    setTimeout(()=>{
                        this.playing = false
                        this.percentage = 0
                        this.currentTime = utils.audioDurationFormat(Math.floor(0))
                        this.audioCtx.offTimeUpdate(listener)
                    }, 1500)
                })

                this.audioCtx.onTimeUpdate(()=>{
                    //console.log(999,'onTimeUpdate')
                    if(!this.getDuration){
                        this.audioDuration = utils.audioDurationFormat(Math.floor(this.audioCtx.duration))
                        this.getDuration = true
                    }

                    this.currentTime = utils.audioDurationFormat(Math.floor(this.audioCtx.currentTime))

                    let current = Math.round(this.audioCtx.currentTime * 10)
                    let duration = Math.round(this.audioCtx.duration * 10)
                    let percentage = Math.ceil((current / duration) * 100)
                    this.percentage = percentage
                    //console.log(999,'percentage',percentage)
                })
            }
        })
    },
    destroyed(){
        //this.audioCtx.destroy()
    },
    methods:{
        play(){
            this.audioCtx.play()
        }    
    }
}
</script>

<style lang="scss" scoped>
.audio-wrap {
    padding:24rpx;
    height:60rpx;
    line-height:60rpx;
    background:#F2F9FF;
    border-radius:54rpx;
    color:#2575FF;
    .audio-btn {
        position:relative;
        display:inline-block;
        margin-right:24rpx;
        width:60rpx;
        height:60rpx;  
        background:#2575FF;
        border-radius:30rpx;
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
            border-top:14rpx solid transparent;
            border-left:16rpx solid #FFF;
            border-bottom:14rpx solid transparent;
            border-right:16rpx solid transparent;
        }
        &.play {
            &:before {
                left:50%;
                border:0 none;
                width:18rpx;
                height:18rpx;
                background:#FFF;
            }
        }
    }
    .progress {
        display:inline-block;
        width:500rpx;
        font-size:24rpx;
        vertical-align:middle;
        span {
            display:inline-block;
            margin:0 8rpx;
            width:60rpx;
            vertical-align:middle;
        }
        .p {
            width:300rpx;
        }
    }
}
</style>