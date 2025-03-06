import utils from '@/utils/utils'
import Vue from 'vue'

let _this = Vue.prototype

export function getOpenidApi(callback){
    uni.login({
        success:(res)=>{
            let params = {
                jscode : res.code
            }
            return new Promise((resolve, reject)=>{
                _this.$http.post(`/tiku/question/user/wxLogin`,params).then((res)=>{
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
        openid : uni.getStorageSync('openid') || ''
    }

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/user/getUserInfo`,params).then((res)=>{
            if(res.data.code == 0){
                let data = JSON.parse(utils.decryptByAES(res.data.encryptParam))
                uni.setStorageSync('userInfo',data)
                resolve(data)
            }
        })
    })
}

export function saveUserInfoApi(params){
    params = Object.assign({}, params, {
        openid : uni.getStorageSync('openid') || ''
    })

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/user/saveUserInfo`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getExamListApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/exam/getExamList`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPaperBySubjectIdApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/paper/getBySubjectId`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getDetailByPaperIdApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/paper/getDetailByPaperId`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getQuestionByPaperIdApi(params){
    params = Object.assign({}, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/paper/getQuestionByPaperId`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function startApi(params){
    params = Object.assign({}, params, {
        openid : uni.getStorageSync('openid') || ''
    })

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/practice/start`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function endApi(params){
    params = Object.assign({}, params, {
        openid : uni.getStorageSync('openid') || ''
    })

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/practice/end`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function analysisApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/practice/analysis`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPracticeApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/practice/getById`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getQuestionApi(params){
    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/practice/analysis/singleQuestion`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPaperDetailApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/paper/getQuestionGroupByPaperId`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getListCollectionApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/question/listCollection`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function setQuestionCollectApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/question/setQuestionCollect`,params).then((res)=>{
            resolve(res)
        })
    })
}

export function getPhoneNumberApi(params){
    params = Object.assign({
        openid : uni.getStorageSync('openid') || ''    
    }, params)

    return new Promise((resolve, reject)=>{
        _this.$http.post(`/tiku/question/wx/getPhoneNumber`,params).then((res)=>{
            resolve(res)
        })
    })
}