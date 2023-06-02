<template>
  <div class="home" ref="thisDom">
    <audio v-bind:src="url" controls autoplay @play="play" @pause="pause"></audio>
  </div>
</template>

<script >
export default {
  name: "Home",
};
</script>
<script setup="props, context" >
import { computed, reactive, ref, onMounted, onActivated } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { searchQuick, searchSong, songUrls, songUrl } from '@/api/QQMusicApi';
import { Toast, Dialog, CellGroup, ConfigProvider } from 'vant';

const VanDialog = Dialog.Component;
const thisDom = ref();
const router = useRouter();
const route = useRoute();

let playLink=route.query.playLink

const url = ref('')

url.value=playLink

onMounted(() => {
})
onActivated(() => {
})


</script>
<style lang="scss">
.home {
  min-height: 100%;
  position: relative;
  background-color: #{$_gb_greyColor};
  overflow: hidden;

  .header,
  .content {
    background-color: #{$_gb_greyColor};
    margin-top: 10px;
    .no-data {
      margin-top: 50px;
    }
  }

  .content{
    .van-cell__title {
            text-align: left;
        }
    .custom-value {
      vertical-align: middle;
      max-height: 100%;
    }
    .custom-albumPic {
      height: 40px;
      max-width: 100%;
    }
    
  }

}
</style>  