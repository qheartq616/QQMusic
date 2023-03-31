<template>
  <div class="err-page">
    <span>{{ msg ||  '未知错误'}}</span>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onActivated } from 'vue'
import { useRoute } from "vue-router";
const route = useRoute();
let msg = route.query.msg;
</script>
<style>
  .err-page{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
  }
</style>

