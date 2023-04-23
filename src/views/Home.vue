<template>
  <div class="home" ref="thisDom">
    <div class="header">
      <van-cell-group inset>
        <van-field v-model="searchKey" input-align="left" clearable left-icon="music-o" placeholder="请输入...">
          <template #button>
            <van-button style="" size="mini" type="primary" @click="search(searchKey)">搜索</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>

    <div class="content">
      <div v-if="!songList.length" class="no-data">暂无记录</div>
      <van-cell-group inset v-else>
        <van-cell center value-class="custom-albumPic" :title="song.name" value="内容" label="描述信息" v-for="(song, index) in songList" :key="song.id" >
          <template #value>
            <img class="custom-albumPic" :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000'+song.albummid+'.jpg'" />
            <!-- <span class="custom-value">
            </span> -->
          </template>
        </van-cell>
      </van-cell-group>
    </div>
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
import { searchQuick, searchSong } from '@/api/QQMusicApi';
import { Toast, Dialog, CellGroup, ConfigProvider } from 'vant';

const VanDialog = Dialog.Component;
const thisDom = ref();
const router = useRouter();

const songList = reactive([]);
const searchKey = ref('')

onMounted(() => {
  search();
})
onActivated(() => {
  search();
})

function search() {
  let param = new FormData();
  param.append('key', searchKey.value||'周杰伦');
  searchSong(param).then(res => {
    if(res.result==100){
      songList.length=0
      songList.push(...res.data.list)
      console.log(songList)
    }
  })
}

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

