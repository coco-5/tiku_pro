<template>
    <view class="footer">
        <view 
            class="footer-blank" 
            :style="style"
        >
        </view>
        <view 
            class="footer-content"
            :style="style"
        >
            <!-- 答题时 -->
            <view 
                class="footer-content1"
                v-if="options.type == 1"
            >
                <view 
                    class="prev" 
                    @click="prev"
                ></view>
                <view 
                    class="next" 
                    @click="next"
                ></view>
                <view class="menu-list">
                    <view 
                        class="item" 
                        @click="isShowDialog = true"
                    >
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-ans-card.png" />
                        <view>答题卡</view>
                    </view>
                    <view 
                        class="item" 
                        @click="$emit('submit')" 
                    >
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-ans-submit.png" />
                        <view>提交试卷</view>
                    </view>
                </view>
            </view>

            <!-- 解析时 -->
            <view 
                class="footer-content2"
                v-else
            >
                <view 
                    class="collection" 
                    @click="editCollect"
                >
                    <view class="pic"></view>
                    <view class="text">收藏</view>
                </view>
                <view 
                    class="datika" 
                    @click="isShowDialog = true"
                    v-if="list.length > 1"
                >
                    <view class="pic"></view>
                    <view class="text">答题卡</view>
                </view>

                <button 
                    class="btn-share"  
                    open-type="share" 
                >
                    <view class="pic">
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_wx_logo.png" />
                    </view>
                    <view class="text">问考友</view>
                </button>
                
                <template v-if="!isShareLanding">
                    <view 
                        class="btn" 
                        @click="goPractise"
                        v-if="options.type == 5"
                    >
                        考试模式
                    </view>
                    <template else>
                        <view 
                            class="btn" 
                            :class="{disabled:list.length - current - 1 == 0}"
                            @click="next"
                            v-if="list.length > 1"
                        >
                            下一题
                        </view>
                    </template>
                </template>

            </view>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        options:{
            type:Object
        },
        list:{
            type:Array,
        },
        current:{
            type:[String,Number],
            default:0
        },
        isShareLanding:{
            type:Boolean,
            default:false
        }
    },
    watch:{
        list:{
            deep:true,
            handler(n){}
        },
        current:{
            deep:true,
            handler(n){
            }
        }
    },
    data(){
        return {
            style:''
        }
    },
    created(){
        this.emitCbFooterHeight()
    },
    methods:{
        emitCbFooterHeight(){
            this.style = `padding-bottom:${utils.fixIPhoneX() ? 68 : 0}rpx;`
            let height = 108 + (utils.fixIPhoneX() ? 68 : 0)
            this.$emit('cbFooterHeight',height)
        },
        prev(){
            if(this.list.length == 0) return
            if(this.current == 0) return
            this.$emit('change',this.current - 1)
        },
        next(){
            if(this.list.length == 0) return
            if(this.current == this.list.length-1) return
            this.$emit('change',(this.current + 1))
        },
        goPractise(){
            this.$emit('practise')
        }
    }
}
</script>

<style lang="scss" scoped>
.footer-blank{
    height:108rpx;
}

.footer-content {
    position:fixed;
    z-index:1;
    bottom:0;
    left:0;
    width:100%;
    height:108rpx;
    background:#FFF;
}
.footer-content1 {
    position:relative;
    padding:0 32rpx;
    .prev,
    .next {
        position:absolute;
        width:40rpx;
        height:40rpx;
        top:50%;
        transform:translateY(-50%);
    }
    .prev {
        left:32rpx;
        background:url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-pre.png') no-repeat center / 100%;
    }
    .next {
        right:32rpx;
        background:url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-next.png') no-repeat center / 100%;
    }
}
.menu-list{
    display:flex;
    padding-top:12rpx;
    justify-content:space-evenly;
    image {
        width:44rpx;
        height:44rpx;
        display:block;
        margin:0 auto 8rpx;
    }
    view {
        font-size:24rpx;
        color:#010B16;
        line-height:34rpx;
        text-align:center;
    }
}

.footer-content2 {
    height:108rpx;
    padding:0 32rpx;
    display:flex;
    justify-content:space-between;
    align-items:center;
    .collection,
    .datika,
    .btn-share {
        font-size:22rpx;
        font-weight:500;
        color:#010B16;
        line-height:22rpx;
        .pic {
            margin:0 auto 10rpx;
            width:42rpx;
            height:42rpx;
        }
    }
    .collection {
        .pic {
            background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-collection.png') no-repeat center / 100% auto;
        }
        &.active {
            color:#366DE8;
            .pic{
                background-image: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-collection-active.png');
            }
        }
        
    }
    .datika {
        .pic { 
            background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-ans-card.png') no-repeat center / 100% auto;  
        }
    }
    .btn-share {
        margin:0;
        padding:0;
        background:transparent;
        border:none;
        .pic {
            margin-bottom:4rpx;
            width:46rpx;
            height:46rpx;
            line-height:46rpx;
            background:#00D6C1;
            border-radius:50%;
            image {
                width:30rpx;
                height:26rpx;
                vertical-align:middle;
            }
        }
    }
    .btn {
        width:382rpx;
        height:88rpx;
        line-height:88rpx;
        border-radius:44rpx;
        background:#2575FF;
        text-align:center;
        font-size:30rpx;
        font-weight:500;
        color:#FFF;
    }
}
</style>