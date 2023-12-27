<template>
    <view 
        class="bottom-nav"
        :style="style"
    >
        <view 
            class="list"
            :style="style"
            v-if="isShowNav"
        >
            <slot name="content">
                <view 
                    class="item"
                    :class="index == current ? 'on' : '' "
                    @click="go(item)"
                    v-for="(item,index) in bottomList"
                    :key="index"
                >
                    <view class="icon"></view>
                    <view class="name">{{item.name}}</view>
                </view> 
            </slot>
        </view>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        current:{
            type:[String,Number],
            default:0
        },
        isShowNav:{
            type:Boolean,
            default:false
        }
    },
    watch:{

    },
    data(){
        return {
            bottomList:[
                {
                    type:'index',
                    name:'首页',
                    icon:'home'
                },
                {
                    type:'mine',
                    name:'我的',
                    icon:'user'
                }
            ],
            style:''
        }
    },
    mounted(){
        this.style = `padding-bottom:${utils.fixIPhoneX() ? 68 : 0}rpx;`
    },
    methods:{
        go(item){
            let url = ``

            uni.switchTab({
                url:url
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.bottom-nav {
    height:100rpx;
    text-align:center
}
.list {
    display:flex;
    position:fixed;
    bottom:0;
    left:0;
    width:100%;
    height:100rpx;
    background:#FFF;
    .item {
        flex:1;
        color:#90919B;
        font-size:24rpx;
        text-align:center;
        .icon {
            margin:14rpx auto 4rpx;
            width:44rpx;
            height:44rpx;
            background:#EEE;
        }
    }
}
</style>