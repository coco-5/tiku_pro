<template>
    <view class="navigation-bar">
        <view 
            class="blank" 
            :style="{height:(statusBarHeight+navBarHeight) + 'px'}"
        >
        </view>
        <view 
            class="fix"
            :style="style" 
        >
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
                        <template v-if="backType == 1">
                            <view class="menu1">
                                <view 
                                    class="back"
                                    @click="handlerGoBack"
                                >
                                    <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_back.png" />
                                </view>
                                <view 
                                    class="home"
                                    @click="goHome"
                                >
                                    <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_home.png" />
                                </view>
                            </view>
                        </template>
                        <template v-else-if="backType == 2">
                            <view class="menu2">
                                <view 
                                    class="back"
                                    @click="handlerGoBack"
                                >
                                    <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_back1.png" />
                                </view>
                                <view 
                                    class="home"
                                    @click="goHome"
                                >
                                    <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_home1.png" />
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <view 
                                class="goback" 
                                v-if="isShowBack" 
                                @click="handlerGoBack"
                            ></view>
                        </template>
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
        },
        backType:{
            type:[Number,String]
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
        goHome(){
            uni.redirectTo({
                url:'/pages/index/index'
            })
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
        background:url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_back.png') no-repeat center / 100%;
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

.menu1,
.menu2 {
    display:flex;
    width:154rpx;
    height:58rpx;
    line-height:1;
    border-radius:32rpx;
    view {
        box-sizing:border-box;
        display:inline-block;
        width:50%;
        height:100%;
        text-align:center;
        vertical-align:middle;
        image {
            vertical-align:middle;
        }
        &.back {
            position:relative;
            &:before {
                content:'';
                position:absolute;
                top:50%;
                right:0;
                transform:translateY(-50%);
                width:1px;
                height:24rpx;
            }
            image {
                width:48rpx;
                height:48rpx;
            }
        }
        &.home {
            margin-top:13rpx;
            image {
                width:34rpx;
                height:34rpx;
            }
        }
    }
}

.menu1 {
    border:1px solid rgba(151, 151, 151, 0.2);
    view {
        &.back {
            image {
                margin-top:6rpx;
            }
            &:before {
                background:rgba(151, 151, 151, 0.2);
            }
        }
    }
}

.menu2 {
    background:rgba(255,255,255,.6);
    border:1px solid rgba(151, 151, 151, 0.2);
    view {
        &.back {
            &:before {
                background:#FFF;
            }
        }
    }
}
</style>