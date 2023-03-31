import server from "@/utils/axios"; 

export const getProjectList = (params) => {
    return server({
        url: "/pj/project/list",
        method: "post" ,
        data: params
    })
}


