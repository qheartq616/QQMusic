let getNewTime = (type) => {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1; //月
    var day = now.getDate() < 10 ? '0' + now.getDate() : now.getDate(); //日

    var hh = now.getHours() < 10 ? '0' + now.getHours() : now.getHours(); //时
    var mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(); //分
    var ss = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds(); //秒

    switch (type) {
        case 'y':
            return `${year}`;
        case 'y-m':
            return `${year}-${month}`;
        case 'y-m-d':
            return `${year}-${month}-${day}`;
        case 'y-m-d h:m':
            return `${year}-${month}-${day} ${hh}:${mm}`;
        case 'y-m-d h:m:s':
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
        default:
            return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
    }
};

// 生成随机id。可选参数：id的长度
function uuid(len = 36) {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < len; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    var uuid = s.join("");
    return uuid;
}

/*
@date：表示格式化的时间；
@fmt：表示格式化的时间格式，如：yyyy-MM-dd hh:mm:ss
*/
function formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
    var o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
    return fmt
}


// 秒秒转换分钟。flag为true:00:00:00格式。flag为false: 1时3分0秒
function timeToMin(times, flag) {
    var t = '';
    if (times > -1) {
        var day = Math.floor(times / 3600 / 24);
        var hour = Math.floor(times / 3600);
        var min = Math.floor(times / 60) % 60;
        var sec = times % 60;

        if (flag) {
            if (hour < 10) {
                t = '0' + hour + ":";
            } else {
                t = hour + ":";
            }

            if (min < 10) { t += "0"; }
            t += min + ":";
            if (sec < 10) { t += "0"; }
            t += sec.toFixed(2);
            t = t.substring(0, t.length - 3);

        } else {
            t += day > 0 ? day + '天' : '';
            t += hour > 0 ? hour + '时' : '';
            if (day == 0 && hour == 0) {
                t += sec > 0 ? sec + '分钟' : '0分钟';
            } else {
                t += sec > 0 ? sec + '分' : '';
            }
        }
    }
    return t;

}

// 客户端是否为移动端
function clientIsMobile() {
    
    var ua = navigator.userAgent,
        isWindowsPhone = /(?:Windows Phone)/.test(ua),
        isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
        isAndroid = /(?:Android)/.test(ua),
        isFireFox = /(?:Firefox)/.test(ua),
        isChrome = /(?:Chrome|CriOS)/.test(ua),
        isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
        isIPhone = /(?:iPhone)/.test(ua) && !isTablet,
        isPc = !isIPhone && !isAndroid && !isSymbian;
    let os = {
        isTablet: isTablet,
        isIPhone: isIPhone,
        isAndroid: isAndroid,
        isPc: isPc
    };
    return os.isAndroid || os.isIPhone;
    
    if (os.isAndroid || os.isIPhone) {
        alert("手机");
    } else if (os.isTablet) {
        alert("平板");
    } else if (os.isPc) {
        alert("电脑");
    }
}

function jsObj(obj) {
    return JSON.parse(JSON.stringify(obj));
}



module.exports = {
    getNewTime,
    uuid,
    formatDate,
    timeToMin,
    clientIsMobile,
    jsObj,
}