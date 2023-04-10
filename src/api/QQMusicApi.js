import server from "@/utils/axios"; 

// 获取用户工时列表
export const getGSList = (params) => {
    return server({
        url: "/pj/gsglGstb/list",
        method: "post" ,
        data: params
    })
}

// // 保存新增工时
// export const saveAddGS = (params) => {
//     return server({
//         url: "/pj/gsglGstb/insert",
//         method: "post" ,
//         data: params
//     })
// }

// // 删除工时
// export const deleteGS = (params) => {
//     return server({
//         url: "/pj/gsglGstb/delete",
//         method: "post" ,
//         data: params,
//         headers: {
//             'Content-Type': 'application/json;charset=UTF-8'
//         },
//     })
// }

// // 修改工时
// export const updateGS = (params) => {
//     return server({
//         url: "/pj/gsglGstb/update",
//         method: "post" ,
//         data: params
//     })
// }

// // 提交工时
// export const submitGS = (params) => {
//     return server({
//         url: "/pj/gsglGstb/gstj",
//         method: "post" ,
//         data: params
//     })
// }


