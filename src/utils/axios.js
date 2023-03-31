import axios from "axios";
import { Toast } from 'vant';
import store from '@/store/index'
import router from '@/router/index'

const server = axios.create({
  // baseURL: 'http://localhost:9090/',
  // baseURL: 'http://172.29.11.44:82/',
  baseURL: '../',
  // timeout: 50000,
  timeout: 1000 * 10,
});

// 请求拦截器:在发请求之前，请求拦截器可以检测到,可以在请求发出去之前做一些事情
server.interceptors.request.use((config) => {
  store.state.loadingShow = true;
  return config;
}, err => {
  Promise.reject(err);
});


// 响应拦截器：包含两个函数（一个是成功返回的函数，一个是失败的返回的函数）
server.interceptors.response.use((res) => {
  store.state.loadingShow = false;
  if (res.data && res.data.errorMessage == '用户未登录') {
    let currentPath = location.hash.replace('#', '');
    sessionStorage.setItem('loginSuccessTo', currentPath);
    router.push('/login');
    return res.data;
  } else {
    return res.data;
  }
}, err => {
  store.state.loadingShow = false;
  Toast.fail(err.message);
  return Promise.reject(err)
  // return promise.reject(new Error('faile'))
});
export default server;
