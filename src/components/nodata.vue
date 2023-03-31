<template>
  <div class="gl-no-data">
    <img src="@/assets/img/no-data.png" alt="" />
    <div class="msg">{{props.msg}}</div>
  </div>
</template>

<script setup >
import { onMounted, defineProps} from 'vue'

const props = defineProps({
  msg : {
    type: String,
    default: '暂无数据',
  }
})


onMounted(() => {
  
})

let itemClick = (item) => {
  
}

</script>
<style lang="scss">
.gl-no-data {
  width: 100%;
  text-align: center;
  img {
    width: 200px;
  }
  .msg {
    padding: 0px 44px;
    font-size: 16px;
    line-height: 32px;
    color: #{$_ft_color};
  }
}
</style>

