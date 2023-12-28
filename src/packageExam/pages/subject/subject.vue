<template>
    <view class="page-subject">
        <c-navigation-bar
            title="设置备考科目"
            style="background:#F2F9FF;"
        >
        </c-navigation-bar>

        <view class="tips">
            <view class="hd">自定义“科目”布局</view>
            <view class="bd">可将自身不需要备考的科目进行隐藏，设置为隐藏后，将在题库练习等相关内容中隐藏科目</view>
        </view>

        <view class="list">
            <view class="hd"><text></text>拖拽可排序</view>
            <view class="bd">
                <view 
                    class="item"
                    v-for="(item, index) in examList"
                    :key="index"
                >
                    <view class="btn"></view>
                    <view class="name">{{item.name}}</view>
                    <view class="switch">
                        显示
                        <switch 
                            :checked="item.checked"
                            color="#2575FF"
                            @change="change(item)"
                        >
                        </switch>
                    </view>
                </view>
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    data(){
        return {
            examList:[
                {
                    name:"中级经济法",
                    checked:true
                },
                {
                    name:"中级经济法11",
                    checked:true
                },
                {
                    name:"中级经济法22",
                    checked:false
                }
            ],
        }
    },
    onLoad(e){
        this.options = e

    },
    onShow(){

    },
    methods:{
        change(item){

        }
    }
}
</script>

<style lang="scss" scoped>
.page-subject {
    min-height:100vh;
    background:#F2F9FF;
}

.tips {
    padding:32rpx 56rpx;
    text-align:center;
    .hd {
        margin-bottom:32rpx;
        height:64rpx;
        line-height:64rpx;
        color:#000222;
        font-size:48rpx;
        font-weight:500;
    }
    .bd {
        line-height:40rpx;
        color:#90919B;
        font-size:28rpx;
    }
}

.list {
    margin:72rpx 32rpx 32rpx;
    .hd {
        margin-bottom:32rpx;
        width:194rpx;
        height:60rpx;
        line-height:60rpx;
        background:#E5F4FF;
        border-radius:30rpx;
        color:#000222;
        font-size:24rpx;
        text-align:center;
    }
    .bd {
        .item {
            position:relative;
            margin-bottom:24rpx;
            padding:0 40rpx;
            height:112rpx;
            line-height:112rpx;
            background:#FFF;
            border-radius:24rpx;
            .btn {
                display:inline-block;
                margin-right:8rpx;
                width:32rpx;
                height:32rpx;
                background:#EEE;
                vertical-align:middle;
            }
            .name {
                display:inline-block;
                color:#000222;
                font-size:32rpx;
                vertical-align:middle;
            }
            .switch {
                position:absolute;
                top:50%;
                right:32rpx;
                transform:translateY(-50%);
                text-align:right;
                color:#2575FF;
                font-size:28rpx;
                switch {
                    margin-left:16rpx;
                    width:72rpx;
                    height:40rpx;
                }
            }
        }
    }
}
</style>