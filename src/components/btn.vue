<template>
  <div class="gl-btn btn_gb_color2 flex-c" @click="btnClick">
    <span v-for="val in btnNameList" :key="val">{{val}}</span>
    <!-- <span >{{props.btnName}}</span> -->
  </div>
</template>

<script setup >
import {onMounted, defineProps, computed} from 'vue'

const props = defineProps({
  btnName: {
    type: String,
    default: '确定',
  },
  clickFun: {
    type: Function,
  }
})
let btnNameList = computed(() => {
  return props.btnName.split('');
})

let btnClick = () => {
  props.clickFun && props.clickFun();
}

onMounted(() => {
  
})


</script>
<style lang="scss">
.gl-btn {
  width: 100%;
  height: 42px;
  color: #fff;
  font-size: 20px;
  border-radius: 26px;
  transition-duration: unset;
  span{
    width: 32px;
  }
  &:active {
    color: rgb(179, 179, 179);
  }
}
</style>

