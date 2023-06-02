import server from "@/utils/axios"; 

// 快速搜索
// 一般用于搜索提示
export const searchQuick = (params) => {
    return server({
        url: "/QQMusicApi/search/quick",
        method: "post",
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// 搜索
export const searchSong = (params) => {
    return server({
        url: "/QQMusicApi/search",
        method: "post",
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// 在线播放
export const songUrls = (params) => {
    return server({
        url: "/QQMusicApi/song/urls",
        method: "post",
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

// 在线下载
export const songUrl = (params) => {
    return server({
        url: "/QQMusicApi/song/url",
        method: "post",
        data: params,
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}