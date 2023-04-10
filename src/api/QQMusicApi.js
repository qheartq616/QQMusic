import server from "@/utils/axios"; 

// 快速搜索
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