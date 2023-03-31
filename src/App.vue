<template>
  <router-view v-slot="{ Component }" class="main">
    <keep-alive include="home,workHour">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <Loading type="spinner" v-show="store.state.loadingShow" class="gl-loading" />
</template>


<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Loading } from 'vant';

window.document.title = '深圳项目实施与服务部'
const router = new useRouter();
const store = new useStore();
let isMobile = util.clientIsMobile();
store.state.isMobile = isMobile || localStorage.getItem('isMobile') === 'isMobile';

let instance = getCurrentInstance();
console.log(instance);
const _this = getCurrentInstance().appContext.config.globalProperties; // 组件实例
console.log(_this.$router);
console.log(_this.$route);
console.log(_this.$store);
console.log(_this.util);

onMounted(() => {
  // input.value.focus()

  console.log('app onMounted')
})

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100vh;

  .gl-loading {
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 100000;
    background: bottom;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(93 94 95 / 77%);
  }
}

.main {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
