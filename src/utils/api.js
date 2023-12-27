import utils from '@/utils/utils'
import Vue from 'vue'

let _this = Vue.prototype

//3460f6ddc3f49e9c0d4afca70720d0463e7b67930ba61eee17c69e8d3cb8657de8db9599c5f712a1a5ffb5088aa2f910aa01792bfa807d65e9fa02ad892b75b8db2ed62d8c52413bad30726f5be7264704

export function getOpenidApi(callback){
    uni.login({
        success:(res)=>{
            let params = {
                jscode : res.code
            }

            return new Promise((resolve, reject)=>{
                _this.$http.post(`/ai/question/user/wxLogin`,params).then((res)=>{
                    if(res.data.code == 0){
                        let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                        uni.setStorageSync('openid',data.openid)
                        resolve()
                        callback()
                    }
                })
            })
        }
    })
}

export function getUserinfoApi(){
    let params = {
        openid : uni.getStorageSync('openid')
    }

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/ai/question/user/getUserInfo`,params).then((res)=>{
            if(res.data.code == 0){
                let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                uni.setStorageSync('userInfo',data)
                resolve(data)
            }
        })
    })
}

export function getUserExerciseApi(params){
    params = Object.assign({}, params, {
        //openid : uni.getStorageSync('openid') || '',
        passport : uni.getStorageSync('passport') || ''
    })

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/japi/tiku/getUserExerciseStatisticByCategory`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getQboxApi(params){
    params = Object.assign({}, params, {
    })

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/kjapi/qbox_api/v1/categories/get_qbox`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getChapterListApi(params){
    params = Object.assign({}, params, {
        passport : uni.getStorageSync('passport') || ''
    })

    return new Promise((resolve, reject)=>{
        _this.$http.get(`/japi/tiku/practice/getChapterItemList`,params).then((res)=>{
            resolve(res)
        })
    })
}