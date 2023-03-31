<template>
  <div class="home">
    <div class="header-bg">
      <img src="@/assets/img/team2.png" alt="" />
    </div>

    <div class="user-info">
      <div class="left flex-c">
        <div class="portrait">{{ user.userName ? user.userName[0] : '-' }}</div>
      </div>
      <div class="center-p">
        <p>深圳项目实施与服务部</p>
        <p>{{ user.userId }} - {{ user.userName }}</p>
      </div>
      <div class="right flex-c">
        <span @click="logout" class="logout">退出</span>
      </div>
    </div>

    <div class="work">
      <div class="it-title">工作平台</div>
      <ul>
        <li v-for="val in menus" class="flex-c" :class="{ active: val.active }" @click="workItemClick(val)">
          <div>
            <!-- @/assets/img/work-hour-entry.png -->
            <div class="img" :class="val.bgCls"></div>
            <p class="msg">{{ val.name }}</p>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script >
export default {
  name: 'home'
}
</script>
<script setup>
import { ref, reactive, computed, onActivated, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from "vue-router";
import { Dialog, Toast } from 'vant';
import { loginOut,getUserRole } from '@/api/user';
import { toRaw } from '@vue/reactivity';

const store = useStore();
const router = useRouter();

// 所有权限路由列表匹配
const routesList = store.state.routesList
// 获取工时管理菜单的数据
let menuList = toRaw(store.state.user.sourceBaseInfoTree) && toRaw(store.state.user.sourceBaseInfoTree).filter(item => item.sourceName == '工时管理')[0].children;

const menus = [];
menuList.forEach(item => {
  if (item.sourceName == '工时填报' || item.sourceName == '工时审批') {
    let menuItem = {
      name: item.sourceName,
      bgCls: 'work-hour-entry',
      path: routesList[item.sourceName].path,
      active: true,
    }
    menus.push(menuItem)
  }

})
//console.log('工时管理:',menuList)
// const menus = reactive([
//   {
//     name: '工时填报',
//     bgCls: 'work-hour-entry',
//     path: '/ydsz/workHour',
//     active: true,
//   },
//   /* {
//     name: '项目维护',
//     bgCls: 'project',
//     path: '',
//     active: false,
//   }, */
// ])
let user = computed(() => {
  return store.getters.userData;
})

onActivated(() => {
  // console.log('home onActivated')
})

// 工作平台项点击
function workItemClick(item) {
  if (!item.active) {
    return
  }
  if (item.path) {
    router.push(item.path)
  }
  // console.log(item.path);
}

function logout() {
  Dialog.confirm({
    message:
      '确定退出账号？',
  })
    .then(() => {
      loginOut().then(res => {
        if (res.issuccess) {
          sessionStorage.removeItem('loginSuccessTo');
          router.go(0); // 刷新页面
        } else {
          Toast.fail(res.errorMessage);
        }
      }).catch(err => {

      })
    })
    .catch(() => {

    });
}
onMounted(() => {
  // 获取全局角色数据
 
})

</script>

<style lang="scss">
.home {
  min-height: 100%;
  background-color: #{$_gb_greyColor};
  padding: 0 8px;

  &>div {
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;
    overflow: hidden;
    width: 100%;
  }

  .header-bg {
    background-color: unset;

    img {
      user-select: none;
      width: 100%;
      border-radius: 8px;
    }

  }

  .user-info {
    display: flex;
    // height: 70px;
    padding: 10px 0px;

    .left {
      padding: 0px 16px;

      .portrait {
        // padding: 10px;
        border-radius: 50%;
        background: rgb(56, 149, 255);
        color: #fff;
        font-size: 20px;
        width: 40px;
        height: 40px;
        line-height: 40px;
      }

    }

    .center-p {
      flex: 1;

      p {
        line-height: 26px;
        text-align: left;
      }
    }

    .right .logout {
      padding-right: 10px;
      color: #818589;
    }
  }

  .work {
    min-height: 260px;
    padding: 10px 0px;

    .it-title {
      text-align: left;
      font-size: 20px;
      padding: 12px 0px 8px 16px;
    }

    ul {
      display: flex;
      flex-wrap: wrap;

      li {
        width: 25%;
        margin-top: 16px;

        div {
          text-align: center;
        }

        .img {
          background-color: rgb(168, 168, 168);
          background-size: 70% 70%;
          background-position: center;
          background-repeat: no-repeat;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          display: inline-block;

          &.work-hour-entry {
            background-image: url('@/assets/img/work-hour-entry.png');
          }

          &.project {
            background-image: url('@/assets/img/project.png');
            background-size: 65% 65%;
            background-position: 62% 50%;
          }
        }

        &.active .img {
          background-color: rgb(245, 157, 50);

          &:active {
            background-color: rgb(119, 192, 252);
          }
        }

        p {
          margin-top: 10px;
          color: rgb(124, 124, 124);
        }
      }
    }
  }


}
</style>
