import CryptoJS from 'crypto-js' 
const key = CryptoJS.enc.Base64.parse('Hz9/OqqFtgkd59RogTmUig==') 

let utils = {
    timeFormat(timestamp = null, fmt = 'yyyy-mm-dd'){
        // 其他更多是格式化有如下:
        // yyyy:mm:dd | yyyy:mm | yyyy年mm月dd日 | yyyy年mm月dd日 hh时MM分等,可自定义组合
        timestamp = parseInt(timestamp);
        
        // 如果为null,则格式化当前时间
        if (!timestamp) timestamp = Number(new Date());
        // 判断用户输入的时间戳是秒还是毫秒,一般前端js获取的时间戳是毫秒(13位),后端传过来的为秒(10位)
        if (timestamp.toString().length == 10) timestamp *= 1000;
        let date = new Date(timestamp);
        let ret;
        let opt = {
            "y+": date.getFullYear().toString(), // 年
            "m+": (date.getMonth() + 1).toString(), // 月
            "d+": date.getDate().toString(), // 日
            "h+": date.getHours().toString(), // 时
            "M+": date.getMinutes().toString(), // 分
            "s+": date.getSeconds().toString(), // 秒
            "S+": date.getMilliseconds().toString() //毫秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    },
    compareBaseSDKVersion(v){
        let sdkv = uni.getSystemInfoSync().SDKVersion
        var va = v.split('.'), sdkva = sdkv.split('.');
        if(va.length != 3) return console.error('检测版本格式错误') || false

        if(v == sdkv) return true
        let is = false 
        for(let i=0;i<sdkva.length;i++){
            if(sdkva[i] > va[i]){
                is = true
                break
            }
            if(sdkva[i] < va[i]) is = false
        }
        return is
    },
    getByteLen(val){
        var len = 0;
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null){
                len += 2;
            }else{
                len += 1;
            }
        }
        return len;
    },
    toPx(rpx){
        let systemInfo = uni.getSystemInfoSync()
        let screenWidth = systemInfo.screenWidth

        let scale = screenWidth / 750
        return parseInt(rpx * scale)
    },
    measureText(text,fontsize){
        text = String(text)
        text = text.split('')
        let width = 0
        text.forEach(function(item){
            if(/[a-zA-Z]/.test(item)){
                width += 7
            }else if (/[0-9]/.test(item)){
                width += 5.5
            }else if (/\./.test(item)){
                width += 2.7
            }else if (/-/.test(item)){
                width += 3.25
            }else if (/[\u4e00-\u9fa5]/.test(item)){ // 中文匹配
                width += 10
            }else if (/\(|\)/.test(item)){
                width += 3.73
            }else if (/\s/.test(item)){
                width += 2.5
            }else if (/%/.test(item)){
                width += 8
            }else {
                width += 10
            }
        })
        return width * fontsize / 10
    },
    encryptByAES(word){
        let srcs = CryptoJS.enc.Utf8.parse(word)
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        return encrypted.toString()
    },
    decryptByAES(word){
        let encryptedHexStr = CryptoJS.enc.Hex.parse(word)
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
        let decrypt = CryptoJS.AES.decrypt(word, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        })
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
    
        return decryptedStr.toString()
    },
    md5(params){
        let partnerSecret = '38fab2a2c1bc64c189651a6f2eaf2616'
        let str = `${params.sequenceNo}${params.uuid}${params.encryptParam}${partnerSecret}`

        return CryptoJS.MD5(str).toString()
    },
    guid(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    },
    timeStamp(){
        return (new Date() * 1)
    },
    formatNumber(n){
        n = n.toString()
        return n[ 1 ] ? n : '0' + n
    },
    fixIPhoneX(){
        let res = uni.getSystemInfoSync()
        if(res.model.indexOf('iPhone') > -1 && res.statusBarHeight > 20){
            return true
        }else{
            return false
        }
    },
}

export default utils