<template>
  <div class="work-approve">
    <van-tabs v-model:active="tabActive" @click-tab="onClickTab">
      <van-tab v-for="(item, index) in tabApprove">
        <template #title> {{ item.name }}<van-badge class="badge-icon" :content="item.numLngth" max="99" />
        </template>
        <div class="tab-content">


          <approve-item  :ref="'approveitem' + index" v-if="approveList[item.key] && approveList[item.key].length > 0"
            :approveList="approveList[item.key]" @getCheckedList="getCheckedList"></approve-item>
          <no-data v-else></no-data>
        </div>

      </van-tab>
    </van-tabs>
    <footer class="footer-gtoup">
      <div class="postbtnGroup">
        <div class="check-btn" v-if="btnStatus">
          <van-button size="small" type="primary" @click="getcheckAll">全选</van-button>
          <van-button size="small" type="primary" @click="gettoggleAll">反选</van-button>
        </div>
      </div>

      <div class="btnGroup">
        <van-button :loading="submitBtn" type="primary" loading-text="提交中..." block
          @click="postWorkTime(1)">确认工时</van-button>
        <van-button :loading="backBtn" type="danger" loading-text="退回中..." block
          @click="postWorkTime(2)">退回工时</van-button>

      </div>
    </footer>



  </div>
</template>

<script >
export default {
  name: "workApprove",
};
</script>
<script setup >
import { computed, createApp, ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useStore } from 'vuex'
import { getApprovelist, summbitWorkTime } from '@/api/user';
import { useRouter, useRoute } from "vue-router";
import { Toast } from 'vant';
import { toRaw } from '@vue/reactivity';
import ApproveItem from './components/approveItem'
import noData from '@/components/nodata.vue'

const store = useStore();
const router = useRouter();
const { proxy } = getCurrentInstance(); //子组件代理

let submitBtn = ref(false);
let backBtn = ref(false)
let btnStatus = ref(null);

// 点击标签页--当前选中标签name值
let checkedtabkey = ref(0);
// 初始换标签页
let tabApprove = ref([
  {
    name: '项目经理',
    numLngth: 0,
    key: 2
  },
  {
    name: '部门主管',
    numLngth: 0,
    key: 1
  }
]);
store.dispatch('getRoleInfo'); // 调用用户角色接口

let roleKey = localStorage.getItem('roleKey')

//所有复选框数据（包括部门经理和部门主管2组）

let checkedLsit =  [];
getApproveList(roleKey); // 遍历获取所有标签下的数据

// tab标签页
const tabActive = ref(0);

const approveList = ref([]);
tabApprove.value.forEach(item => {
  approveList.value.push([])
  checkedLsit.push([]) //选中的复选框数据
})
//utc 日期转换
function getUtcDate(date) {
  let y = date.getUTCFullYear();
  let m = date.getUTCMonth();
  let d = date.getUTCDate();
  let h = date.getUTCHours();
  let M = date.getUTCMinutes();
  let s = date.getUTCSeconds();
  return Date.UTC(y, m, d, h, M, s);

}

// 查询审批列表
async function getApproveList(key) {



  let approveStatus = ''
  if (key == 1) {   // 2: 项目经理  1：部门主管  （key:tab标签的值非接口数据中的用户角色）
    approveStatus = '审批中'

  } else if (key == 2) {
    approveStatus = '待确认'
  }

  let today = new Date();
  let lastDay = new Date(today.getTime() - 1000 * 60 * 60 * 24)
  today = util.formatDate(today, 'yyyy-MM-dd');
  lastDay = util.formatDate(lastDay, 'yyyy-MM-dd');
  let queryParams = new FormData();
  queryParams.append('today', new Date(today + ' 23:59:59'))
  queryParams.append('lastday', new Date(lastDay + ' 00:00:00'))
  queryParams.append('rows', 100)
  queryParams.append('page', 1)
  queryParams.append('gszt', approveStatus) // 0:部门经理 1：部门主管

  await getApprovelist(queryParams).then(res => {
    let resArr = res.data.rows
    approveList.value.splice(key, 1, resArr); // 将请求到的数组替换到声明的空白数组中
    
    tabApprove.value.filter(item => {
      if (item.key == roleKey) {
        item.numLngth = res.data.total  // 写入当前角色数据总数
        btnStatus.value = +toRaw(tabApprove.value)[checkedtabkey.value].numLngth > 0 ? true : false; //切换全选按钮组可见性

      }
    })
     
  })

}
//全选反选

function getcheckAll() { //全选 
  //console.log('全选:', proxy.$refs,checkedtabkey)
  proxy.$refs['approveitem' + checkedtabkey.value][0].checkAll()
}
function gettoggleAll() { //反选
  proxy.$refs['approveitem' + checkedtabkey.value][0].toggleAll()
}

// 所有选中的复选框
// 切换标签
function onClickTab(res) {

  checkedtabkey.value = res.name; //当前选中的tab页
 
  btnStatus.value = +toRaw(tabApprove.value)[checkedtabkey.value].numLngth > 0 ? true : false; //切换全选按钮组可见性

}

// 获取复选框数据
function getCheckedList(res) {
 // console.log('子组件:',proxy.$refs['approveitem' + checkedtabkey.value][0].checked)
  checkedLsit[checkedtabkey.value] = res // 每一次点击复选框，重新写入当前标签页已勾选的所有数据。
}
// 提交工时
function postWorkTime(status) {
  console.log('当前的数据checkedLsit:',checkedLsit[checkedtabkey.value])
  if (status == 1) {
    submitBtn.value = true
  } else {
    backBtn.value = true
  }

  if (checkedLsit[checkedtabkey.value].length > 0) {
    let workIdList = []
  
    workIdList =  checkedLsit[checkedtabkey.value].map(item => {
      return item.id
    })
    let param = {
      auditState: status,  // 1:确认  0:退回
      idList: workIdList
    }
    summbitWorkTime(param).then(res => {
      if (res.issuccess) {
        let restitle = status == 1 ? '确认成功' : '退回成功'
        Toast({
          message: restitle,
          icon: 'success',
        });
        proxy.$refs['approveitem' + checkedtabkey.value][0].checked = []   //清空子组件复选框已选择项
        console.log('提交后的数据checkedLsit:',checkedLsit)
        getApproveList(roleKey) // 加载新的列表,传当前角色值roleKey，checkedtabkey为当前所在标签页的值
        //location.reload()
      } else {
        Toast({
          message: res.errorMessage,
          icon: 'fail',
        });
      }


    }).catch(err => {

      Toast({
        message: res.errorMessage,
        icon: 'fali',
      });
    }).finally(() => {
      submitBtn.value = false
      backBtn.value = false
    })
  } else {
    Toast({
      message: '请至少选择一项进行审批！',
      icon: 'fail',
    });
    submitBtn.value = false
    backBtn.value = false
  }
}

onMounted(() => {


})

</script>
<style lang="scss" scoped>
.tab-content {
  margin: 20px 0;
  text-align: left;
}
</style>

<style  lang="scss">
.van-tab {
  font-size: 16px;
}

.van-badge {
  transform: translate(0%, -16%) !important;
  line-height: 1.3;
  margin-left: 2px;
}

.van-tabs {
  padding-bottom: 7rem;
}

.van-tabs__line {
  width: 50%;
  height: 2px;
  background: #265cdc;

}

.footer-gtoup {
  width: 100%;

  background-color: #f5f2f2;

  position: fixed;
  z-index: 9;
  bottom: 0;
  left: 0;
}

// 全选按钮
.postbtnGroup {
  width: 100%;
  text-align: right;
  padding-right: 1rem;
  margin-top: 1rem;

  .van-button {
    margin: 0 5px;
  }
}

//底部提交按钮
.btnGroup {
  width: 100%;
  height: 5rem;

  display: flex;
  justify-content: space-around;
  align-items: center;

  .van-button--block {
    margin: 1rem;
    height: 2.5rem;
    font-size: 14px;
  }
}
</style>