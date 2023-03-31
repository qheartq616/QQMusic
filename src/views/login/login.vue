<template>
  <div class="login flex-c" style="height: 100%;">
    <van-form @submit="onSubmit">
      <h2>华信永道</h2>
      <h3>深圳项目实施与服务部</h3>
      <van-cell-group inset>
        <van-field v-model="username" name="user_name" label="工号" placeholder="工号"
          :rules="[{ required: true, message: '请填写工号' }]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]" />
      </van-cell-group>
      <div style="margin: 16px;position: relative">
        <van-button round block type="primary" native-type="submit">
          登录
        </van-button>
        <p class="tip" v-show="showTip">{{ loginFailTips }}</p>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { toLogin, getUserInfo,getUserRole } from '@/api/user';
import { Toast } from 'vant'
let loginFailTips = ref('账号或密码错误');
let showTip = ref(false);
let username = ref('');
let password = ref('');

const router = useRouter();
const route = useRoute();
const store = useStore();

// 登录
function onSubmit(params) {
  let _params = {
    userId: params.user_name,
    password: params.password,
  }
  toLogin(_params).then(res => {
    console.log(res);
    if (res.issuccess) {
      getUserInfo().then(res => {
        console.log('用户信息', res);
        if (res.issuccess) {
          let user = {
            userId: res.data.userId,
            userName: res.data.userName,
            sourceBaseInfoTree: res.data.sourceBaseInfoTree,
            sourceBaseInfos: res.data.sourceBaseInfos,
          }
          store.commit('setUser', user);
          // 调用角色
          getUserRole().then(res => {
            let roleKey = res.data
            localStorage.setItem('roleKey', roleKey) // 缓存角色值

          })
          let path = sessionStorage.getItem('loginSuccessTo') || '/';
          sessionStorage.removeItem('loginSuccessTo')
          router.replace(path);
        } else {
          Toast.fail(res.errorMessage || '登录异常');
        }
      }).catch(err => {
        console.log(err)
        Toast.fail(res.errorMessage || '登录异常');
      })
    } else {
      Toast.fail(res.errorMessage || '登录异常');
    }

  })
}

</script>
<style lang="scss">
.login {
  .tip {
    color: red;
    margin-top: 1rem;
    position: absolute;
    bottom: -2rem;
    width: 100%;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 60px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 30px;
  }
}
</style>

