import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/reset.scss';
import '@/assets/css/common.scss';
import { Form, Field, Cell, CellGroup, Button, Icon, Search, Checkbox, RadioGroup, Radio, CheckboxGroup, Popup, Stepper, Tab, Tabs, Badge, ConfigProvider } from 'vant';
import 'vant/lib/index.css';
import util from '@/utils/util'

/* 
import VConsole from 'vconsole';
// 或者使用配置参数来初始化，详情见文档
const vConsole = new VConsole({ theme: 'dark' });
// 接下来即可照常使用 `console` 等方法
console.log('Hello vConsole');
// 结束调试后，可移除掉
// vConsole.destroy();
 */

window.util = util;

let app = createApp(App);
app.config.globalProperties.util = util;  // getCurrentInstance().appContext.config.globalProperties.util可在模板表达式中使用
app.use(store)
  .use(router)
  .use(Form)
  .use(Field)
  .use(Cell)
  .use(Search)
  .use(CellGroup)
  .use(RadioGroup)
  .use(Radio)
  .use(Button)
  .use(Icon)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Popup)
  .use(Stepper)
  .use(Tab)
  .use(Tabs)
  .use(Badge)
  .use(ConfigProvider)
  .mount('#app');



  app.config.devtools=true



