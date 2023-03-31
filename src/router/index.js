import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import store from '@/store/index'
import { toRaw } from '@vue/reactivity';


// 所有权限路由列表匹配
const routesList = store.state.routesList

const routes = [
  {
    path: '/',
    redirect: '/home',
  },

  {
    path: '/login',
    name: 'login',
    meta: {
      needLogin: false,
      title: '登录',
    },
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/home',  // 首页
    name: 'home',
    meta: {
      needLogin: true,
      title: '深圳项目实施与服务部',
    },
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/err',
    name: 'err',
    meta: {
      needLogin: false,
      title: '提示页面',
    },
    component: () => import('@/views/err/err.vue'),
  },
  // {
  //   // 工时填报-首页
  //   path: '/ydsz/workHour',
  //   name: 'workHour',
  //   meta: {
  //     needLogin: true,
  //     title: '工时填报',
  //   },
  //   component: () => import('@/views/workHour/workHour.vue'),
  // },
  {
    // 添加工时
    path: '/ydsz/addWorkHour',
    name: 'addWorkHour',
    meta: {
      needLogin: true,
    },
    component: () => import('@/views/workHour/addWorkHour.vue'),
  },

]
const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  // if (!to.path.startsWith('/err') && !store.state.isMobile) {
  //   next('/err?msg=请在手机浏览器中打开该网页');
  //   return;
  // }

  let isLogin = Object.keys(store.state.user).length > 0;
  if (!isLogin && to.meta.needLogin && to.path != '/login') {

    store.dispatch('getUserInfo').then((res) => {
      if (res == 1) {

        next()
      } else {
        // next({path:'/login', query: {loginSuccessTo: to.path}, })
        sessionStorage.setItem('loginSuccessTo', to.path);
        next('/login');
      }
    }).catch(() => {
      next();
    })
  } else if (isLogin && to.path == '/login') {
    // 已登录的情况下不允许进入登录页面
    next(from.path);
  } else {
    if (to.meta.title) {
      document.title = to.meta.title
    }
    if (to.matched.length === 0) { //页面刷新vuex存放路由数据被清空
      // console.log('当前所有路由；', router.getRoutes())
      let role = new Promise((resolve, reject) => {
        store.dispatch('getUserInfo');  //重新加载权限路由
        resolve()
      }).then(() => {
        setTimeout(() => {
          let roleList = toRaw(store.state.roleList);
          roleList.forEach(item => router.addRoute('/', item)) // 重新动态添加路由
          next({ ...to, replace: false });
        }, 800);
      })
    } else {
      next();
    }
  }
});
export default router
