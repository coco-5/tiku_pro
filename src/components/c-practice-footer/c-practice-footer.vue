<template>
    <view class="c">
        <view class="footer-blank" :style="{paddingBottom:isIphoneX ? '68rpx':''}"></view>
        <view class="footer-container" :style="{paddingBottom:isIphoneX ? '68rpx':''}">
            <!-- 答题时 -->
            <view class="footer-content1" v-if="type == 1 || isShowAddCard">
                <view class="pre" @click="pre"></view>
                <view class="next" @click="next"></view>
                <view class="menu-list">
                    <view class="item" @click="isShowDialog = true">
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-ans-card.png"></image>
                        <view>答题卡</view>
                    </view>
                    <view class="item"  @click="$emit('submit')" v-if="type == 1">
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-ans-submit.png"></image>
                        <view>提交试卷</view>
                    </view>
                </view>
            </view>
            <!-- 解析时 -->
            <view class="footer-content2" v-else>
                <view class="collection" :class="{active:isCollectList[qid]}" @click="editCollect">
                    <div class="pic"></div>
                    <div class="text">收藏</div>
                </view>
                <view class="btn-box">
                    <div class="btn-01" :class="{active:isAnalysised}" v-if="isShareLanding" @click="handlerAnalysis">查看解析</div>
                    <button class="btn-02" :class="{width:isShareLanding}" open-type="share" data-q-share="1">
                        <image src="https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-wx-share-logo.png"></image>
                        <text>问考友</text>
                    </button>
                </view>
            </view>
        </view>

        <!-- 答题卡弹窗 -->
        <view class="dialog" v-if="isShowDialog">
            <view class="dialog-mask"></view>
            <view class="dialog-content">
                <view class="close" @click="isShowDialog = false"></view>
                <view class="title">答题卡</view>
                <view class="list">
                    <view class="group" v-for="(item,index) in ansCardList" :key="index">
                        <view class="group-name">{{item.groupName}}</view>
                        <view class="group-list" v-if="item.sort.length > 0">
                            <view :class="{active:current == (v-1)}" v-for="(v,i) in item.sort" :key="i" @click="change(v-1)">{{v}}</view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    props:{
        list:{
            type:Array,
        },
        // 1答题  2解析 3阅读模式，不展示解析 4阅读模式，展示解析
        type:{
            type:[String,Number],
        },
        // 答题卡分组列表 array {groupName:'分组标题',sort:[1,2,3]}
        ansCardList:{
            type:Array
        },
        // 当前swiper index
        current:{
            type:[String,Number],
            default:0
        },
        // 是否是分享落地页
        isShareLanding:{
            type:Boolean,
            default:false
        },
        // 查看解析时是否显示答题卡
        isShowAddCard:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            isIphoneX:false,
            isShowDialog:false,
            isAnalysised:false,
            boxId:0,
            isCollectList:{},
            qid:'',
        }
    },
    watch:{
        current(nv){
            this.qid = this.list[nv].id
        },
        list(nv){
            this.qid = nv[0].id
            if(!this.isShowAddCard && (this.type == 2 || this.type == 4)){
                this.getCategoryQbox()
            }
        }
    },
    created(){
        this.isIphoneX = this.$hq.utils.isIphoneX()
    },
    methods:{
        pre(){
            if(this.list.length == 0) return;
            if(this.current == 0) return;
            this.$emit('change',this.current - 1)
        },
        next(){
            if(this.list.length == 0) return;
            if(this.current == this.list.length-1) return;
            this.$emit('change',(this.current + 1))
        },
        change(current){
            if(this.current == current) return;
            this.isShowDialog = false
            this.$emit('change',current)
        },
        handlerAnalysis(){
            if(this.isAnalysised) return;
            this.isAnalysised = true
            this.$emit('analysis')
        },
        getCategoryQbox() {
            let categoryId = this.list[0].category_id
            let data = {
                category_ids:categoryId
            }
            this.$hq.get('/qbox_api/v1/categories/get_category_qbox',data).then(res=>{
                if(res.data.status.code == 0){
                    if(res.data.data.length > 0){
                        this.boxId = res.data.data[0].id
                        this.getIsCollect()
                    }
                }
            })
        },
        //  获取是否收藏
        getIsCollect() {
            let questionIds = []
            this.list.map(item=>{
                questionIds.push(item.id)
            })
            let data = {
                edu24ol_token: true,
                question_ids: questionIds.join(','),
                box_id: this.boxId
            }
            this.$hq.get('/qbox_api/v1/record/is_collect',data).then(res=>{
                if (res.data.status.code == 0) {
                    this.isCollectList = res.data.data || {}
                }
            })
        }, 
        // 收藏
        editCollect(){
            let data = {
                question_id:this.qid,
                edu24ol_token:true,
                is_collect:this.isCollectList[this.qid] ? '1' : '0',  //是否添加 0收藏 1取消收藏, 默认0
                box_id:this.boxId,
            }
            uni.showLoading({title:'加载中...',mask:true})
            this.$hq.get('/qbox_api/v1/record/add_myfavorite',data).then(res=>{
                uni.hideLoading()
                if(res.data.status.code == 0 && res.data.data == 'success'){
                    this.$set(this.isCollectList,this.qid,this.isCollectList[this.qid] ? false : true)
                }else{
                    uni.showToast({
                        title:res.data.status.msg,
                        icon:'none'
                    })
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.footer-blank{
    height: 108rpx;
}
.footer-container{
    background: #fff;
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 1;
}
.footer-content1{
    height: 108rpx;
    padding: 0 32rpx;
    position: relative;
    .pre,.next{
        width: 40rpx;
        height: 40rpx;
        position: absolute;
        top:50%;
        transform: translateY(-50%);
    }
    .pre{
        left:32rpx;
        background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-pre.png') no-repeat center / 100%;
    }
    .next{
        right:32rpx;
        background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-next.png') no-repeat center / 100%;
    }
}
.menu-list{
    padding-top: 12rpx;
    display: flex;
    justify-content: space-evenly;
    image{
        width: 44rpx;
        height: 44rpx;
        display: block;
        margin: 0 auto 8rpx;
    }
    view{
        font-size: 24rpx;
        color: #010B16;
        line-height: 34rpx;
        text-align: center;
    }
}
.dialog-mask{
    width: 100%;
    height: 100%;
    position: fixed;
    left:0;
    top:0;
    background: rgba(0,0,0,.7);
    z-index: 9;
}
.dialog-content{
    width: 100%;
    border-radius: 24rpx 24rpx 0px 0px;
    position: fixed;
    left:0;
    bottom:0;
    background: #fff;
    z-index: 9;
    .close{
        width: 58rpx;
        height: 58rpx;
        position: absolute;
        right:18rpx;
        top:18rpx;
        background: url('http://oss-hqwx-edu24ol.hqwx.com/miniapp/swan_tiku_pro/icon-close.png') no-repeat center / 100% 100%;
    }
    .title{
        padding-top: 56rpx;
        font-size: 36rpx;
        color: #3D4044;
        line-height: 44rpx;
        text-align: center;
        margin-bottom: 32rpx;
    }
    .list{
        padding: 0 0 0 30rpx;
        min-height: 210rpx;
        max-height: 730rpx;
        overflow-y: auto;
        .group{
            margin-bottom: 16rpx;
            .group-name{
                font-size: 28rpx;
                font-weight: 500;
                color: #3D4044;
                line-height: 40rpx;
                margin-bottom: 16rpx;
            }
            .group-list{
                display: flex;
                flex-wrap: wrap;
                &>view{
                    width: 70rpx;
                    height: 70rpx;
                    border-radius: 50%;
                    border: 2rpx solid #E4E9EC;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 28rpx;
                    font-weight: 500;
                    color: #3D4044;
                    margin-bottom: 24rpx;
                    margin-right: 54rpx;
                    box-sizing: border-box;
                    &:nth-child(6n){
                        margin-right: 0;
                    }
                }
                .active{
                    border-color:#548cfd;
                    background: #548cfd;
                    color:#fff;
                }
            }
        }
        
    }
} 

.footer-content2{
    height: 108rpx;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.collection{
    font-size: 22rpx;
    font-weight: 500;
    color: #010B16;
    line-height: 22rpx;
    .pic{
        height: 42rpx;
        height: 42rpx;
        margin: 0 auto 10rpx;
        background: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-collection.png') no-repeat center / 100% auto;
    }
    &.active{
        color:#366DE8;
        .pic{
            background-image: url('https://oss-hqwx-edu24ol.hqwx.com/miniapp/tushu_hqwx/icon-collection-active.png');
        }
    }
    
}
.btn-box{
    display: flex;
}
.btn-01{
    width: 274rpx;
    height: 80rpx;
    border-radius: 40rpx;
    border: 2rpx solid #366DE8;
    box-sizing: border-box;
    text-align: center;
    font-size: 30rpx;
    font-weight: 500;
    color: #366DE8;
    line-height: 76rpx;
    margin-right: 32rpx;
    &.active{
        border-color:#C8C8C8;
        color:#C8C8C8;
    }
}
.btn-02{
    width: 580rpx;
    height: 80rpx;
    background: #4BC083;
    border-radius: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    &.width{
        width: 274rpx;
    }
    image{
        width: 32rpx;
        height: 32rpx;
        margin-right: 16rpx;
    }
    text{
        font-size: 30rpx;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 42rpx;
    }
}
</style>