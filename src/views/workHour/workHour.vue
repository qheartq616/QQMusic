<template>
  <div class="work-hour" ref="thisDom">
    <div class="header flex">
      <div class="flex-c" @click="showChooseDate = true">
        <van-field v-model="checkedDate" readonly="" right-icon="arrow-down" input-align="center" />
      </div>
      <div class="flex-c right">
        <div>
          <span>合计工时：</span>
          <span class="total" :class="{ warn: totalHour < 7.5 }">{{ totalHour }}</span>
        </div>
      </div>

    </div>
    <div class="content">
      <div v-if="!gsList.length" class="no-data">暂无工时记录</div>
      <ul v-else>
        <li v-for="(val, index) in gsList" :key="val.id" 
          :class="{ editable: val.editable, 'op-active': !!val.opActive}" >
          <div class='item-ct' @click="touchHourItem(val)">
            <div class="title">
              <span>{{ `${(index + 1)}.任务类型：${val.gslx || '-'}` }}</span>
              <span>
                <!-- <van-icon name="edit" v-if="val.gszt == '待提交' || (val.gszt && val.gszt.includes('退回'))"/> -->
                <span :class="{ dtj: val.gszt == '待提交', th: val.gszt && val.gszt.includes('退回') }">【{{ val.gszt }}】</span>
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
    <div class="btn-submit">
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
    </van-dialog>
  </div>
</template>

<script >
export default {
  name: "workHour",
};
</script>
<script setup="props, context" >
import { computed, reactive, ref, onMounted, onActivated } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { getGSList, deleteGS, submitGS} from '@/api/hour';
import { Toast , Dialog} from 'vant';

const VanDialog = Dialog.Component;
const thisDom = ref();
const store = useStore();
const router = useRouter();
const showChooseDate = ref(false)
const totalHour = ref(0)
let gstj_doneFlag = false;

const checkedDate = ref('')

let now = new Date();
let d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
d1 = util.formatDate(d1, 'yyyy-MM-dd')
let d2 = util.formatDate(now, 'yyyy-MM-dd')
const dateList = reactive([d2, d1]);
checkedDate.value = dateList[0];

const gsList = reactive([]);

getGsList();

onMounted(() => {
})
onActivated(() => {
  getGsList();
})

// 工时列表
function getGsList() {
  let param = new FormData();
  param.append('page', 1);
  param.append('rows', 1000);
  param.append('tbrq', checkedDate.value);
  getGSList(param).then(res => {
    if (res.rows instanceof Array) {
      gsList.length = 0;
      totalHour.value = 0;
      gsList.push(...res.rows);
      gsList.forEach(val => {
        totalHour.value += Number(val.gs);
        val.editable = val.gszt == '待提交' || (val.gszt && val.gszt.includes('退回'));
      })
      if (totalHour.value < 7.5 && gstj_doneFlag) {
        gstj_doneFlag = false;
        Dialog({ message: '请留意已提交的总工时少于7.5小时' });
      }
    }
  })
}

// 点击工时-绑定时不传参时
function touchHourItem2(event) {
  let currentDomClass = event.currentTarget.classList; 
  let domClass = event.target.classList; 
  if (domClass.contains('edit')) {
    editGs();
  } else if (domClass.contains('del')) {
    delGs();
  } else if (currentDomClass.contains('editable')) {
    if (currentDomClass.contains('op-active')) {
      currentDomClass.remove('op-active')
    } else {
      currentDomClass.add('op-active');
    }
  } else {

  }
}

// 点击工时-绑定时不传参时,则参数代替event
function touchHourItem(obj) {
  if (obj.editable) {
    obj.opActive = !obj.opActive;
  }
}

// 删除工时
function delGs(obj) {
  Dialog.confirm({
    message: '确定删除工时？',
  }).then(() => {
    deleteGS(obj.id).then(res => {
      if (res.issuccess != undefined && !res.issuccess) {
        Toast.fail(res.errorMessage);
      } else {
        Toast('删除成功')
        getGsList();
      }
    });
  }).catch(() =>{})
}
// 修改工时
function editGs(obj) {
  obj.opActive = false;
  router.push({
    path: '/ydsz/addWorkHour',
    query: { date: checkedDate.value, type: 'edit', gsObj: JSON.stringify(obj)},
  })
}

// 提交工时
function submit() {
  let flag = gsList.some(val => val.gszt == '待提交');
  if (!flag) {
    Toast('暂无可提交工时');
    return;
  }
  Dialog.confirm({
    message: '确定提交工时？',
  })
    .then(() => {
      let param = {tbrq: checkedDate.value};
      submitGS(param).then(res => {
        if (res.issuccess) {
          gstj_doneFlag = true;
          getGsList();
          Toast('工时提交成功！')
        } else {
          Dialog({ message: res.errorMessage });
        }
      })
      
    })
    .catch(() => {
      // on cancel
    });
}

// 跳转至添加工时页面
function toAddWorkHour() {
  router.push({
    path: '/ydsz/addWorkHour',
    query: { date: checkedDate.value},
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
    background-color: #fff;
    .no-data {
      margin-top: 50px;
    }
  }

  .header {
    margin-bottom: 10px;
    display: flex;
    height: 60px;

    &>* {
      width: 50%;
    }

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

