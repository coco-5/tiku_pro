<template>
    <view 
        class="navigation-bar"
        :style="style"
    >
        <view 
            class="blank" 
            :style="{height:(statusBarHeight+navBarHeight) + 'px'}"
        >
        </view>
        <view class="fix">
            <view 
                class="status-bar" 
                :style="{height:statusBarHeight + 'px'}"
            >
            </view>
            <view 
                class="nav-bar" 
                :style="{height:navBarHeight + 'px',lineHeight:navBarHeight + 'px',margin:margin}"
            >
                <view class="nav-bar-left">
                    <slot name="left">
                        <view 
                            class="goback" 
                            v-if="isShowBack" 
                            @click="handlerGoBack"
                        ></view>
                    </slot>
                </view>
                <view class="nav-bar-title-box">
                    <slot name="content">
                        <view class="title">{{title}}</view>
                    </slot>  
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        style:{
            type:[String,Object]
        },
        title:{
            type:String
        },
        gobackCallback:{
            type:[Function,String],
            default:''
        }
    },
    data(){
        return{
            statusBarHeight:0,
            navBarHeight:44,
            margin:0,
            isShowBack:false
        }
    },
    created(){
        let system = uni.getSystemInfoSync()
        let menuButtonInfo  = uni.getMenuButtonBoundingClientRect()
        this.statusBarHeight = system.statusBarHeight
        this.left = (system.screenWidth - menuButtonInfo.right) + 'px'
        this.margin = `0 ${system.screenWidth - menuButtonInfo.right}px`
        let currentPages = getCurrentPages()
        if(currentPages[currentPages.length-1].route.indexOf('pages/index/index') == -1){
            this.isShowBack = true
        }

        let height = this.statusBarHeight + this.navBarHeight

        this.$emit('cbNavigationHeight',height)
    },
    methods:{
        handlerGoBack(){
            if(typeof this.gobackCallback  != 'function'){
                this.goback()
            }else{
                this.gobackCallback(this.goback)
            }
        },
        goback(){
            let currentPages = getCurrentPages()
            if(currentPages.length == 1){
                uni.redirectTo({
                    url:'/pages/index/index'
                })
            }else{
                uni.navigateBack()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.navigation-bar {
    background:#FFF;
}

.fix {
    width:100%;
    position:fixed;
    top:0;
    z-index:1;
    .nav-bar {
        position:relative;
    }
    .nav-bar-left {
        height:100%;
        position:absolute;
        left:0;
        top:0;
        display:flex;
        align-items:center;
    }
    .goback {
        width:48rpx;
        height:48rpx;
        background:url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-back.png') no-repeat center / 100%;
    }
    .nav-bar-title-box {
        .title {
            font-size:34rpx;
            font-weight:bold;
            color:#010B16;
            text-align:center;
        }
    }
}
</style>