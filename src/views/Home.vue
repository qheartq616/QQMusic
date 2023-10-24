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
        <van-cell clickable center @click="playMusic(song)" value-class="custom-albumPic" :title="song.name" value="内容"
          :label="song.albumname" v-for="(song, index) in songList" :key="song.id">
          <template #value>
            <img class="custom-albumPic" :src="'https://y.gtimg.cn/music/photo_new/T002R300x300M000' + song.albummid + '.jpg'" />
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
import { searchQuick, searchSong, songUrls, songUrl } from '@/api/QQMusicApi';
import { Toast, Dialog, CellGroup, ConfigProvider } from 'vant';
import Play from './Play.vue';

const VanDialog = Dialog.Component;
const thisDom = ref();
const router = useRouter();

const songList = ref([]);
const searchKey = ref('')
const open=ref(true)

onMounted(() => {
  search();
})
onActivated(() => {
  search();
})

function search() {
  let param = new FormData();
  param.append('key', searchKey.value || '梁静茹');
  searchSong(param).then(res => {
    if (res.result == 100) {
      songList.value=res.data.list
      console.log(songList)
    } else {
      Toast.fail('搜索失败，请重试！')
    }
  })
}

function playMusic(song) {
  let param = new FormData();
  param.append('id', song.songmid);
  // 这个字段为其他接口中返回的 strMediaId 字段，可不传，不传默认同 songmid，但是部分歌曲不传可能会出现能获取到链接，但实际404， 所以有条件的大家都传吧
  // param.append('mediaId', song.strMediaMid);
  // 默认 0，非 0 时直接重定向到播放链接
  // param.append('isRedirect', 0);
  songUrl(param).then(res => {
    console.log(res)
    if (res.result == 100) {
      let playLink = res.data
      console.log(playLink)
      router.push({
        name: 'play',
        query: { playLink: playLink },
      })
    } else {
      Toast.fail('播放失败，可能是登陆过期了，请联系我！')
    }
  })
}

</script>

<style lang="scss">
.home {
  min-height: 100%;
  position: relative;
  background-color: #{$_gb_greyColor};
  overflow: auto !important;

  .header {
    padding-top: 10px;
  }
  .content {
    background-color: #{$_gb_greyColor};
    margin-top: 10px;

    .no-data {
      margin-top: 50px;
    }
  }

  .content {
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

  .play {
    // z-index: 999;
    min-height: 100vh;
  }

}</style>

