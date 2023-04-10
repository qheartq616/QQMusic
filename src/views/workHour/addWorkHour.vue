<template>
  <div class="add-work-hour">
    <p class="hour-date">日期：{{ date }}</p>
    <div v-for='val in data' class="item">
      <p>{{ val.title }}</p>
      <van-field v-if="val.type == 'hour'" v-model="val.value"  placeholder="请输入" class="val"
        type="number" maxlength="4" @blur="checkHour" />
      <van-field v-else-if='val.type == "content"'  class="desc" v-model="val.value" autosize type="textarea" maxlength="200" show-word-limit
        @focus="showSaveBtn = false" @blur="showSaveBtn = true" />
      <div v-else class="val" @click="val.click">{{ val.value || '请选择' }}</div>
    </div>

    <div class="item qrr" v-for='val in data'>
      <div v-if="val.type == 'project' && val.value">
        <p>一级确认人：{{ val.obj.projecterName }}</p>
        <p>二级确认人：段璋</p>
      </div>
    </div>


    <!-- 工作类型 -->
    <van-dialog v-model:show="workType.show" :showConfirmButton='false' closeOnClickOverlay
      class="ydsz-dialog-radio-group">
      <van-radio-group v-model="workType.selected">
        <van-radio v-for="val in workType.list" :name="val.value" @click="workTypeItemClick(val.label)">{{
          val.label
        }}</van-radio>
      </van-radio-group>
    </van-dialog>

    <!-- 所属项目 -->
    <van-dialog v-model:show="project.show" :showConfirmButton='false' closeOnClickOverlay
      class="ydsz-dialog-radio-group project">
      <div class="header">
        <h4>选择项目</h4>
        <van-icon name="cross" class="close-c-p" @click="project.show = false"/>
        <van-search v-model="project_keyword" shape="round" placeholder="请输入关键词" @click-right-icon22="searchProject"
           left-icon="" @clear="searchProject" @update:model-value="searchProject"/>
      </div>
      <div class="list">
        <ul>
          <li v-for="val in project.listShow" class="click_gb_color2" @click="projectClick(val)">
            <div class="label"><span>{{ val.name }}</span></div>
            <div class="code"><span>{{ val.code }}</span></div>
          </li>
        </ul>
      </div>
    </van-dialog>

    <!-- 所用工时 -->
    <van-dialog v-model:show="hour.show" :showConfirmButton='false' closeOnClickOverlay
      class="ydsz-dialog-radio-group selected-hour">
      <van-radio-group v-model="hour.selected">
        <van-radio v-for="val in hour.list" :name="val.value" @click="hourItemClick(val.label)">{{
          val.label
        }}</van-radio>
      </van-radio-group>
    </van-dialog>

    <div class="btn-submit" v-show="showSaveBtn">
      <van-button round block type="primary" @click="save">保存</van-button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { getProjectList } from '@/api/project'
import { saveAddGS, updateGS } from '@/api/hour'
import { useRouter, useRoute } from "vue-router";
import { Dialog, Toast } from 'vant';
import VirtualKeyboard from '@/utils/virtualKeyboard'
const VanDialog = Dialog.Component;

const store = useStore();
const router = useRouter();
const route = useRoute();
let date = route.query.date;
let thisType = route.query.type || 'add';
let gsObj = thisType == 'edit' ? JSON.parse(route.query.gsObj) : {};
console.log(gsObj);
const project_keyword = ref('');
const showSaveBtn = ref(true);

// 工作类型列表
const workType = reactive({
  show: false,
  selected: '项目工作工时',
  list: [
    { label: '项目工作工时', value: '项目工作工时' },
    // { label: '请选择', value: '' },
    // { label: '部门工作工时', value: '部门工作工时' },
    // { label: '项目支持工时', value: '项目支持工时' },
  ]
})

// 项目列表
const project = reactive({
  show: false,
  selected: '',
  list: [],
  listShow: [],
})

// 工时列表
let hourList = [{ label: '请选择', value: '' }];
let maxVal = 7.5,
  step = 0.5;
while (maxVal > 0) {
  hourList.push({ label: maxVal + '小时', value: maxVal });
  maxVal -= step;
}
const hour = reactive({
  show: false,
  selected: '',
  list: hourList,
})

const data = reactive([
  {
    type: 'workType',
    attr: 'gslx',
    title: '工作类型',
    value: '项目工作工时',
    click: () => { workType.show = true },
  },
  {
    type: 'project',
    title: '所属项目',
    attr: 'xmmc',
    value: '',
    obj: {},
    click: showProjectLayer,
  },
  {
    type: 'hour',
    attr: 'gs',
    title: '所用工时',
    value: '',
    click: () => { hour.show = true },
  },
  {
    type: 'content',
    attr: 'tbnr',
    title: '工作内容',
    value: '',
  },
])
// console.log(route.params.date);

// 用户信息- 使用的时候user.value
const user = computed(() => {
  return store.state.user;
})

let virtualKeyboard;
onMounted(() => {
  editDataShow();

  virtualKeyboard = new VirtualKeyboard();
  virtualKeyboard.onStart();
  // 虚拟键盘弹出
  virtualKeyboard.onShow(() => {
    showSaveBtn.value = false;
    console.log('虚拟键盘弹出要执行的事件')
  })

  // 虚拟键盘收起
  virtualKeyboard.onHidden(() => {
    showSaveBtn.value = true;
    console.log('虚拟键盘收起要执行的事件')
  })
})

onBeforeUnmount(() => {
  virtualKeyboard.onEnd();
})

// 修改时的回显
function editDataShow() {
  if (thisType == 'edit') {
    getProjectData().then(list => {
      let projectObj = project.list.find(val => val.code == gsObj.xmbh);
      if (projectObj) {
        let item = data.find(val => val.type == 'project');
        item.obj = projectObj;
      }
    })

    data.forEach(val => {
      if (gsObj[val.attr] != undefined && gsObj[val.attr] != null) {
        val.value = gsObj[val.attr]
      }
    })
  }
}

// 保存按钮
function save() {
  setTimeout(() => {
    let param = {
      tbrq: date,
      gszt: "待提交",
    }
    let obj;
    let pass = true;
    data.forEach(val => {
      if (pass) {
        if (val.type == 'project'){
          obj = val.obj;
        }
        if (val.value) {
          param[val.attr] = val.value;
        } else {
          pass = false;
          Toast(`“${val.title}”不能为空`);
        }
      }
    })
    if (!pass) {
      return;
    }
    param.xmjl = obj.projecterName;
    param.xmbh = obj.code;
    
    let fun = thisType == 'edit' ? saveEdit : saveAdd;
    fun(param);
  }, 100)
}

// 保存-新增
function saveAdd(param) {
  param.gszt = '待提交';
  console.log(param);
  saveAddGS(param).then(res => {
    if (res.issuccess != undefined && !res.issuccess) {
      Toast.fail(res.errorMessage)
    } else {
      Toast('新增成功')
      router.replace('/ydsz/workHour');
    }
  })
}

// 保存-修改
function saveEdit(param) {
  param.id = gsObj.id;
  console.log(param);
  updateGS(param).then(res => {
    if (res.issuccess != undefined && !res.issuccess) {
      Toast.fail(res.errorMessage)
    } else {
      Toast('修改成功')
      router.replace('/ydsz/workHour');
    }
  })
}

// 检验工时
function checkHour() {
  let obj = data.find(i => i.type == 'hour')
  let val = obj.value;
  if (Number(val) > 24) {
    obj.value = 24
  } else if (Number(val) < 0.5){
    obj.value = 0.5
  } else {
    let value = Number(Number(val).toFixed(1));
    let floor = Math.floor(value);
    let ceil = Math.ceil(value);
    if (value * 10 - floor * 10 < 3){
      obj.value = floor;
    } else if (ceil * 10 - value * 10 < 3) {
      obj.value = ceil;
    } else {
      obj.value = floor + 0.5;
    }
  }
}

// 点击选择工作类型
function workTypeItemClick(value) {
  workType.show = false;
  let obj = data.find(val => val.type == 'workType')
  obj.value = value;
  // todo:更新所属项目数据
}

// 点击选择工时
function hourItemClick(value) {
  hour.show = false;
  let obj = data.find(val => val.type == 'hour')
  obj.value = value;
}

function showProjectLayer() {
  project.show = true
  getProjectData().then(() => {
    searchProject();
  })
}

// 获取项目列表
function getProjectData() {
  return new Promise((resolve, reject) => {
    let param = new FormData();
    param.append('page', 1);
    param.append('rows', 1000);
    param.append('isOwner', 1);
    getProjectList(param).then(res => {
      if (res.data && res.data.rows instanceof Array) {
        project.list = res.data.rows;
        resolve()
      } else {
        reject();
        Toast.fail(res.errorMessage || '服务异常')
      }
    })
  })
}

// 搜索项目
function searchProject() {
  let keyword = project_keyword.value;
  if (keyword.trim() != '') {
    let list = [];
    project.list.forEach(val => {
      if (val.code.includes(keyword) || val.name.includes(keyword)) {
        list.push(val);
      }
    })
    project.listShow = list;
  } else {
    project.listShow = project.list;
  }
}

// 选择好项目
function projectClick(projectObj) {
  let item = data.find(val => val.type == 'project');
  item.value = projectObj.name;
  item.obj = projectObj;
  project.show = false;
}

</script>
<style lang="scss">
.add-work-hour {
  min-height: 100%;
  position: relative;
  text-align: left;
  padding-top: 16px;
  overflow: hidden;

  .hour-date {
    padding-left: 10px;
    margin-bottom: 16px;
    // .input-hour{
    //   // border:1px 
    // }
  }

  .item {
    padding: 0px 10px;
    margin-bottom: 16px;

    p {
      font-weight: bold;
      margin-bottom: 10px;
    }

    .val{
      width: 100%;
      border: 0.5px solid rgb(201, 200, 200);
      line-height: 30px;
      padding: 0px 10px;
    }

    .desc {
      border: 0.5px solid rgb(201, 200, 200);
      padding: 5px 10px;
    }
  }
  .qrr{
    color: rgb(0, 110, 255);
  }

  .ydsz-dialog-radio-group.project {
    &.van-dialog {
      top: 50%;
      border-radius: 8px;
      width: 96%;
      height: 98%;
      padding: 0px;
    }

    .van-dialog__content {
      padding: 0px;
      height: 100%;
    }

    .header {
      height: 80px;
      position: relative;
      border-bottom: 5px solid rgb(219, 219, 219);
      h4{
        text-align: center;
        padding-top: 16px;
      }
      .exit-btn {
        border: 0.5px solid rgb(130, 187, 252);
        border-radius: 4px;
        height: 26px;
        width: 56px;
        margin-left: 10px;
        color: rgb(116, 116, 116);
        font-size: 14px;
      }
      .van-search {
        flex:1;
      }
      .close-c-p {
        position: absolute;
        right: 10px;
        top:10px;
      }
    }

    .list {
      height: calc(100% - 80px);
      overflow: auto;

      ul {
        font-size: 12px;

        li {
          border-bottom: 0.5px solid rgb(233, 232, 232);
          display: flex;
          padding: 5px 8px;
          min-height: 46px;
        }

        .label,
        .code {
          display: flex;
          justify-items: center;
          align-items: center;
        }

        .label {
          flex: 1;
          color: rgb(77, 77, 77);

          span {
            line-height: 18px;
          }
        }

        .code {
          span {
            padding: 6px 5px;
            background-color: rgb(228, 228, 228);
            border-radius: 3px;
          }
        }
      }
    }
  }

  .ydsz-dialog-radio-group.selected-hour {
    &.van-dialog {
      top: 50%;
      border-radius: 8px;
    }

    .van-radio {
      height: 36px;
      font-size: 12px;
    }

    .van-radio__icon {
      font-size: 16px;
    }
  }


  .btn-submit {
    position: absolute;
    bottom: 16px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 80%;
  }

  
}
</style>

