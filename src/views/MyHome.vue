<template>
  <van-config-provider>
    <div class="work-hour" ref="thisDom">
      <div class="header flex">
        <!-- <div class="flex-c" @click="showChooseDate = true">
        <van-field v-model="checkedDate" readonly="" right-icon="arrow-down" input-align="center" />
      </div>
      <div class="flex-c right">
        <div>
          <span>合计工时：</span>
          <span class="total" :class="{ warn: totalHour < 7.5 }">{{ totalHour }}</span>
        </div>
      </div> -->
        <!-- <div class="flex">
        <van-field v-model="searchKey" input-align="left" clearable left-icon="music-o" placeholder="请输入..."/>
      </div> -->
        <van-cell-group inset>
          <van-field v-model="searchKey" input-align="left" clearable left-icon="music-o" placeholder="请输入...">
            <template #button>
              <van-button style="" size="mini" type="primary" @click="search(searchKey)">搜索</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </div>

      <div class="content">
        <div v-if="!searchList.length" class="no-data">暂无记录</div>
        <ul v-else>
          <li v-for="(val, index) in searchList" :key="val.id"
            :class="{ editable: val.editable, 'op-active': !!val.opActive }">
            <div class='item-ct' @click="touchHourItem(val)">
              <div class="title">
                <span>{{ `${(index + 1)}.任务类型：${val.gslx || '-'}` }}</span>
                <span>
                  <!-- <van-icon name="edit" v-if="val.gszt == '待提交' || (val.gszt && val.gszt.includes('退回'))"/> -->
                  <span :class="{ dtj: val.gszt == '待提交', th: val.gszt && val.gszt.includes('退回') }">【{{ val.gszt
                  }}】</span>
                </span>
              </div>
              <div class="item">
                <label>工时：</label>
                <span>{{ val.gs }}</span>
              </div>
              <div class="item">
                <label>项目：</label>
                <span>{{ val.xmmc }}</span>
              </div>
              <div class="item">
                <label>内容：</label>
                <span>{{ val.tbnr }}</span>
              </div>
            </div>

            <div class="op" v-if="val.editable">
              <span class="btn del" @click="delGs(val)">删除</span>
              <span class="btn edit" @click="editGs(val)">修改</span>
            </div>
          </li>
        </ul>
      </div>
      <!-- <div class="btn-submit">
        <van-button round block type="primary" @click="submit">提交工时</van-button>
      </div>
      <div class="btn-add flex-c" @click="toAddWorkHour">
        <van-icon name="plus" />
      </div>

      <van-dialog v-model:show="showChooseDate" :showConfirmButton='false' closeOnClickOverlay
        class="ydsz-dialog-radio-group">
        <van-radio-group v-model="checkedDate" @change="getGsList">
          <van-radio v-for="val in dateList" :name="val" @click="showChooseDate = false">{{ val }}</van-radio>
        </van-radio-group>
      </van-dialog> -->
    </div>
  </van-config-provider>
</template>

<script >
export default {
  name: "MyHome",
};
</script>
<script setup="props, context" >
import { computed, reactive, ref, onMounted, onActivated } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { getGSList, deleteGS, submitGS } from '@/api/hour';
import { searchQuick } from '@/api/QQMusicApi';
import { Toast, Dialog, CellGroup, ConfigProvider } from 'vant';

const VanDialog = Dialog.Component;
const thisDom = ref();
const store = useStore();
const router = useRouter();
const showChooseDate = ref(false)

let now = new Date();
let d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
d1 = util.formatDate(d1, 'yyyy-MM-dd')
let d2 = util.formatDate(now, 'yyyy-MM-dd')
const dateList = reactive([d2, d1]);

const searchList = reactive([]);
const searchKey = ref('')
const themeVars = reactive({
  buttonMiniHeight: "auto"
})

onMounted(() => {
})
onActivated(() => {
  //search();
})

function search() {
  let param = new FormData();
  param.append('key', searchKey.value);
  searchQuick(param).then(res => {
    console.log(res)
  })
}

</script>
<style lang="scss">
.work-hour {
  min-height: 100%;
  position: relative;
  background-color: #{$_gb_greyColor};
  overflow: hidden;

  .header,
  .content {
    background-color: #{$_gb_greyColor};

    .no-data {
      margin-top: 50px;
    }
  }

  .header {
    margin-top: 10px;
    margin-bottom: 10px;
    // display: flex;
    // height: 60px;

    // &>* {
    //   width: 50%;
    // }

    .van-field__right-icon {
      color: rgb(65, 65, 65);
    }

    .right {
      .total {
        color: rgb(0, 110, 255);

        &.warn {
          color: red;
        }
      }
    }
  }

  .content {
    height: calc(100% - 150px);
    overflow: hidden;

    ul {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }

    li {
      position: relative;
      left: 0px;
      margin-top: 16px;
      border-bottom: 0.5px solid rgb(214, 214, 214);

      .item-ct {
        padding: 8px 16px;
        width: 100%;
      }

      .title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;

        span:nth-child(1) {
          font-weight: bold;
          text-align: left;
        }

        span:nth-child(2) {
          color: rgb(0, 110, 255);
          min-width: 82px;
          text-align: right;
        }

        span.dtj {
          color: #1a1a1a;
        }

        span.th {
          color: red;
        }
      }

      .op {
        height: 100%;
        position: absolute;
        right: -120px;
        width: 120px;
        display: flex;
        top: 0px;

        span:nth-child(1) {
          background-color: rgb(253, 53, 53);
        }

        span:nth-child(2) {
          background-color: rgb(47, 137, 253);
        }

        span {
          display: flex;
          color: #fff;
          width: 50%;
          justify-content: center;
          align-items: center;

        }
      }

      &.op-active {
        left: -120px;
      }

      .item {
        text-align: left;
        margin-bottom: 10px;
      }
    }
  }

  .btn-submit {
    position: relative;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;

    .van-button {
      width: 80% !important;
    }
  }

  .btn-add {
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 40px;
    height: 40px;
    background-color: rgb(38, 136, 247);
    border-radius: 50%;

    &:active {
      background-color: rgb(100, 169, 248);
    }

    .van-icon {
      color: #fff;
      font-size: 30px;
    }
  }

}
</style>

