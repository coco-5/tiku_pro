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
import utils from '@/utils/utils'
export default {
    data(){
        return {
            dragId:-1,
            subjectList:[
                {
                    name:"中级经济法",
                    checked:true,
                    y:0, 
                },
                {
                    name:"中级经济法11",
                    checked:true,
                    y:69
                },
                {
                    name:"中级经济法22",
                    checked:false,
                    y:138
                }
            ],
            gab:69
        }
    },
    onLoad(e){
        this.options = e
    },
    onShow(){

        //this.subjectList[0].y = 150
    },
    methods:{
        change(item){

        },
        move(e){
            this.y = e.detail.y
            this.dragId = e.target.dataset.id
        },
        end(e){
            //知道自己的排序
            let subjectList = this.subjectList
            let currentId = this.y / this.gab
            let transferId

            if(this.dragId > currentId){
                transferId = Math.ceil(currentId)
            }else{
                transferId = Math.floor(currentId)
            }

            let dragItem = subjectList.splice(this.dragId, 1)
            subjectList.splice(transferId, 0, dragItem[0])

            this.$set(subjectList[0],'y',0)
            this.$set(subjectList[1],'y',69)
            this.$set(subjectList[2],'y',138)/* 
            subjectList.forEach((item,index)=>{
                item.y = index * this.gab
                this.$set(subjectList,index,item)
                console.log(999,'item',item)
            })  */

            this.subjectList = subjectList
            this.dragId = -1
            console.log(999,'subjectList',subjectList)

            //this.dragId = -1
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