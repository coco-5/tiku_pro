<template>
    <view class="a">
        <c-pop
            :isShow="isShowInfo"
            height="670rpx"
            @cbClosePop="cbClosePop"
        >
            <template #content>
                <view class="win win-user-info">
                    <form @submit="submit">
                        <view class="win-main">
                            <view class="hd">
                                <view class="title">完善头像昵称</view>
                                <view
                                    class="close"
                                    @click="cbClosePop"
                                > 
                                </view>
                            </view>
                            <view class="bd">
                                <view class="avatar">
                                    <block v-if="isCompare">
                                        <button class="btn-upload" open-type="chooseAvatar" @chooseavatar="chooseavatar">
                                            <image 
                                                class="face"
                                                :src="avatar ? avatar : avatarDefault"
                                            />
                                            <view class="ico"></view>
                                        </button>
                                    </block>
                                    <block v-else>
                                        <view class="btn-upload" open-type="chooseAvatar"  @click="chooseMedia">
                                            <image 
                                                class="face"
                                                :src="avatar ? avatar : avatarDefault"
                                            />
                                            <view class="ico"></view>
                                        </view>
                                    </block>
                                </view>
                                <view class="name">
                                    <input 
                                        id="name" 
                                        name="nickname" 
                                        v-model="name"
                                        :type="isCompare ? 'nickname' : 'text'" 
                                        placeholder="请输入昵称" 
                                        maxlength="16" 
                                        @nicknamereview="nicknamereview"
                                    />
                                </view> 
                            </view>
                            <view 
                                class="ft"
                                :style="style"
                            >
                                <button 
                                    class="btn" 
                                    form-type="submit"
                                    :class="(avatar && name) ? '' : 'disabled'"
                                >
                                    保存
                                </button>
                            </view>
                        </view>
                    </form>
                </view>
            </template>
        </c-pop>
    </view>
</template>

<script>
import utils from '@/utils/utils'
export default {
    props:{
        isShowInfo:{
            type:Boolean
        },
        userInfo:{
            type:Object
        }
    },
    watch:{
        isShowInfo:{
            deep:true,
            handler(nv){}
        }
    },
    data(){
        return{
            isCompare:false,
            name:'',
            avatar:'',
            avatarDefault:'https://oss-hqwx-edu24ol.hqwx.com/miniapp/hq_training/ai/common/user-default.png',
            style:''
        }
    },
    mounted(){
        this.isCompare = utils.compareBaseSDKVersion('2.21.2')

        if(this.userInfo){
            this.name = this.userInfo.nickName
            this.avatar = this.userInfo.avatarUrl
        }

        this.style = `padding-bottom:${utils.fixIPhoneX() ? 68 : 0}rpx;`
    },
    methods:{
        chooseavatar(e){
            if(e.detail.avatarUrl){
                this.uploadFile(e.detail.avatarUrl)
            }
        },
    	chooseMedia() {
    		uni.chooseMedia({
    			count: 1,
    			mediaType:['image'],
				sizeType:['compressed'],
    			success: (res) => {
    				if(res.errMsg == 'chooseMedia:ok'){
    				    this.uploadFile(res.tempFiles[0].tempFilePath)
    				}
    			}
    		})
    	},
        save(){

        },
        uploadFile(filePath){
            uni.showLoading()

			uni.uploadFile({
				url:`http://www.river0413.top/question/user/uploadAvatar`,
                name:'avatar',
                filePath:filePath,
                success:(res)=>{
                    uni.hideLoading()
                    if(res.statusCode == 200){
                        let json = JSON.parse(res.data)
                        if(json.code == 0){
                            let data = JSON.parse(utils.decryptByAES(json.encryptParam))
                            this.avatar = data.avatarUrl
                        }
                    }
                },
                fail:(res)=>{
                    uni.hideLoading()
                }
			})
        },
        nicknamereview(e){
            //console.log(999,'nicknamereview',e)
        },
        submit(e){
            let name = e.detail.value.nickname
            let avatar = 'https://res.wx.qq.com/mpres/zh_CN/htmledition/comm_htmledition/images/icon/login/mp_enterprise_small672c62.png'

            let params = {
                nickname : name,
                avatar : this.avatar
            }

            saveUserInfoApi(params).then((res)=>{
                if(res.data.code == 0){
                    //let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                    uni.showToast({
                        title: '保存成功',
                        icon:'none'
                    })
                    this.$emit('cbSubmit')
                }
            })
        },
        cbClosePop(){
            this.$emit('cbCloseUserinfo',true)    
        }
    } 
}
</script>

<style lang="scss" scoped>
.win-main {
    box-sizing:border-box;
    position:absolute;
    z-index:13;
    bottom:0;
    left:0;
    width:100%;
    height:100%;
    border-radius:30rpx 30rpx 0 0;
    .hd {
        position:relative;
        margin:40rpx 0;
        height:50rpx;
        line-height:50rpx;
        color:#000222;
        font-size:36rpx;
        font-weight:500;
        text-align:center;
        .close {
            position:absolute;
            top:50%;
            right:32rpx;
            transform:translateY(-50%);
            width:36rpx;
            height:36rpx;
            background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_close.png") no-repeat;
            background-size:contain;
        }
    }
    .ft {
        position:absolute;
        bottom:16rpx;
        left:0;
        width:100%;
        .btn {
            margin:0 auto;
            width:686rpx;
            height:92rpx;
            line-height:92rpx;
            background:#2575FF;
            border-radius:46rpx;
            color:#FFF;
            font-size:32rpx;
            text-align:center;
            &.disabled {
                opacity:.4;    
            }
        }
    }
}

.avatar {
    margin:40rpx auto 0;
    width:144rpx;
    height:144rpx;
    .btn-upload {
        position:relative;
        margin:0;
        padding:0;
        width:144rpx;
        height:144rpx;
        background:#FFF;
    }
    .face {
        width:144rpx;
        height:144rpx;
        border-radius:50%;
        overflow:hidden;
    }
    .ico {
        position:absolute;
        bottom:0;
        right:0;
        width:48rpx;
        height:48rpx;
        background:url("https://oss-hqwx-edu24ol.hqwx.com/miniapp/socrazy/tikupro/common/ico_cemara.png") no-repeat;
        background-size:contain;
    }
}

.name {
    margin:32rpx auto 0;
    width:516rpx;
    height:80rpx;
    line-height:80rpx;
    border-bottom:1px solid #EEF2F2;
    border-radius:40rpx;
    text-align:center;
    input {
        height:80rpx;
        line-height:80rpx;
        color:#ADB1B5;
        font-size:28rpx;
    }
}
</style>