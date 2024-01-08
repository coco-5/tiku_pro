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
            <view class="a">
                <view 
                    class="b"
                    v-for="(item, index) in subjectList"
                    :key="index"
                >
                    {{item.name}}
                </view>
            </view>
            <!-- <view class="bd">
                <view 
                    class="item"
                    :class="dragId == index ? 'active' : ''"
                    :style="'top:' + item.y + 'px;'"
                    v-for="(item, index) in subjectList"
                    :key="index"
                    :data-id="index"
                    @touchstart="touchstart"
                    @touchmove="touchmove"
                    @mousedown="touchend"
                    @touchcancel="touchend"
                >
                    <view class="btn"></view>
                    <view class="name">{{item.y}} - {{item.name}}</view>
                    <view class="switch">
                        显示
                        <switch 
                            :checked="item.checked"
                            color="#2575FF"
                            @change.stop="change(item)"
                        >
                        </switch>
                    </view>
                </view>
            </view> -->
            <movable-area class="bd">
                <movable-view
                    class="item"
                    :class="dragId == index ? 'active' : ''"
                    :y="item.y"
                    :data-id="index"
                    direction="vertical"
                    @change="move"
                    @touchend="end"
                    v-for="(item, index) in subjectList"
                    :key="index"
                >
                    <view class="btn"></view>
                    <view class="name">{{item.y}} - {{item.name}}</view>
                    <view class="switch">
                        显示
                        <switch 
                            :checked="item.checked"
                            color="#2575FF"
                            @change.stop="change(item)"
                        >
                        </switch>
                    </view>
                </movable-view>
            </movable-area> 
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
//https://github.com/shinewen189/nigo-vue-drag.git
//https://github.com/yijinc/fishui
import utils from '@/utils/utils'
export default {
    data(){
        return {
            dragId:-1,
            subjectList:[
                {
                    name:"中级经济法",
                    checked:true,
                },
                {
                    name:"中级经济法11",
                    checked:true,
                },
                {
                    name:"中级经济法22",
                    checked:false,
                }
            ],
            gab:138
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){
        this.initMove()
    },
    methods:{
        initMove(){
            let subjectList = this.subjectList
            let arr = []

            subjectList.forEach((item,index)=>{
                let obj = item
                obj.id = index
                obj.y = index * this.gab
                arr.push(obj)
            })
            this.subjectList = arr
        },
        sort(obj1, obj2){ 
            let val1 = obj1.y
            let val2 = obj2.y

            if(val1 < val2){
                return -1
            }else if(val1 >= val2){
                return 1
            }else{
                return 0
            } 
        },
        change(item){

        },
        move(e){
            this.y = e.detail.y
            this.dragId = e.target.dataset.id
        },
        end(){
            this.subjectList[this.dragId].y = this.y
            this.subjectList.sort(this.compare)

            setTimeout(()=>{
                this.initMove()
            })
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
        position:relative;
        width:100%;
        height:1000rpx;
        .item {
            box-sizing:border-box;
            position:absolute;
            top:0;
            left:0;
            z-index:1;
            padding:0 40rpx;
            width:100%;
            height:112rpx;
            line-height:112rpx;
            background:#FFF;
            border-radius:24rpx;
            &.active {
                z-index:2;
                opacity:.5;
                background:#000;
            }
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