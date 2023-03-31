import { createStore } from 'vuex'
import { getUserInfo,getUserRole } from '@/api/user'
import { Toast } from 'vant'
import { toRaw } from '@vue/reactivity';


export default createStore({
  state: {
    user: {},
    goToPage: null,
    isMobile: false,    // 是否为移动端
    loadingShow: false,
    roleKey: null,
    routesList: {
      '工时审批': {
        path: '/ydsz/workApprove',
        componentName: 'workApprove'
      },
      '工时填报': {
        path: '/ydsz/workHour',
        componentName: 'workHour'
      },
      '项目维护': {
        path: '/ydsz/workMaintain',
        componentName: 'workMaintain'
      },
    },
    roleList: {}
  },
  getters: {
    userData(state) {
      return state.user;
    }
  },
  mutations: {
    setUser(state, value) {
      state.user = value;
    },
    setGoToPage(state, value) {
      state.goToPage = value;
    },
    setRoleList(state, value) {
      state.roleList = value;
    },
    setRolekey(state, value) {
      state.roleKey = value;
    
    }

  },
  actions: {
    getUserInfo: (content) => {
      const routesList = toRaw(content.state.routesList)
      return new Promise((resolve, reject) => {
        getUserInfo().then(res => {
          if (res.issuccess) {
            let user = {
              userId: res.data.userId,
              userName: res.data.userName,
              sourceBaseInfoTree: res.data.sourceBaseInfoTree,
              sourceBaseInfos: res.data.sourceBaseInfos,
            }
            content.commit('setUser', user);
          
            let menuTree = toRaw(res.data.sourceBaseInfoTree)
           let list = toRaw(menuTree) && toRaw(menuTree).filter(item => item.sourceName == '工时管理')[0].children;

            let listArr = []
           
            list.forEach(item => { // 对权限路由遍历添加进路由表
              
              if(item.sourceName == '工时审批' || item.sourceName == '工时填报') { //目前只匹配这两项
      
                let menuItem = {
                  path: routesList[item.sourceName].path,
                  name: routesList[item.sourceName].componentName,
                  meta: {
                    needLogin: true,
                    title: item.text,
                  },
                  component: () => import(`@/views/${routesList[item.sourceName].componentName}/${routesList[item.sourceName].componentName}.vue`),
                }
                
              listArr.push(menuItem)
              }
            })
            content.commit('setRoleList', listArr); // 修改格式化后的路由表
           
            resolve(1);
          } else {
            resolve(0);
          }
        }).catch(err => {
          if (err.message && err.message.includes('timeout')) {
            Toast.fail('连接超时，可能网络异常');
          }
          reject(err)
        })
      })
    },
    getRoleInfo:(content) => {
      return new Promise((resolve,reject) => {
        getUserRole().then(res => {
   
          let roleKey = res.data
         localStorage.setItem('roleKey',roleKey) // 缓存角色值
          content.commit('setRolekey', roleKey); 
          resolve()
        })
      })
    }
  },
  modules: {
  }
})
