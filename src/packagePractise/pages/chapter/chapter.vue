<template>
    <view class="page-chapter">
        <c-navigation-bar
            title="章节练习"
            backType="1"
        >
        </c-navigation-bar>
        
        <c-tab
            :list="subjectList"
            :current="subjectIndex"
            @change="changeSubject"
        >
        </c-tab>

        <view class="list">
            <view class="item">
                <view class="level">
                    <view class="actions"></view>
                    <view class="name">第一章：建设工程基本经济知识</view>
                    <view class="desc">
                        <view class="process">完成进度: <text>22/158</text></view>
                        <view class="rate">正确率: <text>20%</text></view>
                    </view>
                    <view class="btn">练习</view>
                </view>
                <view class="item-jie">
                        <view class="item">
                        <view class="actions"></view>
                        <view class="name">第一章：建设工程基本经济知识</view>
                        <view class="desc">
                            <view class="process">完成进度: <text>22/158</text></view>
                            <view class="rate">正确率: <text>20%</text></view>
                        </view>
                        <view class="btn">练习</view>

                    </view>

                </view>
            </view>
        </view>

        <c-bottom></c-bottom>
    </view>
</template>

<script>
export default {
    data(){
        return {
            options:'',
            subjectList:[],//科目列表
            subjectIndex:0,//当前选择的科目
            chapterList:[],//章节列表
        }
    },
    onLoad(e){
        this.options = e

        this.subjectList = ['中经','初会','教资','高经','一造','消费设施操作员','中经','初会','教资','高经','一造','消费设施操作员']
    },
    onShow(){

    },
    methods:{
        
    }
}
</script>