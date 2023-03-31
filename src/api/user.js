import server from "@/utils/axios"; 

// 用户登录
export const toLogin = (params) => {
    return server({
        url: "/pj/user/login",
        method: "post" ,
        data: params
    })
}

// 用户登出
export const loginOut = (params) => {
    return server({
        url: "/pj/user/loginOut",
        method: "post" ,
        data: params
    })
}

// 用户详情
export const getUserInfo = (params) => {
    return server({
        url: "/pj/user/info",
        method: "post" ,
        data: params,
        timeout: 5000,
    })
}
// 用户角色
export const getUserRole = (params) => {
    return server({
        url: "/pj/sysAppraiseEmployeeInfo/simpleRole",
        method: "post" ,
        data: params,
        timeout: 5000,
    })
}
// 用户角色--审批列表
export const getApprovelist = (params) => {
    return server({
        url: "/pj/gsglGstb/auditList",
        method: "post" ,
        data: params,
        timeout: 5000,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 提交工时
export const summbitWorkTime = (params) => {
    return server({
        url: "/pj/gsglGstb/audit",
        method: "post" ,
        data: params,
        timeout: 5000,
    })
}



