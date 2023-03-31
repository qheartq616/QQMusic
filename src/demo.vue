<template>
  <div class="aaaa">
    
  </div>
</template>

<script setup>
import {ref, reactive ,onMounted } from 'vue'
import { useRouter, useRoute } from "vue-router";
let active = ref('11');
let data = reactive([
  2,3
])
function fun() {
  console.log('dd');
}
const router = useRouter();
const route = useRoute();

defineExpose({
  active,
  data,
  fun,
})
onMounted(() => {
  
})

</script>
<style lang="scss">
.aaa {
  
}
</style>

