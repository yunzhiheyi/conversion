import { createSSRApp } from 'vue';
import Notify from './wxcomponents/vant/notify/notify';
import Toast from './wxcomponents/vant/toast/toast';
import store from './store/index';
import Api from './api/request';
import Tools from './utils/tools';
import ApiPath from './api/index';
import App from './App.vue';
export function createApp() {
  const app = createSSRApp(App).use(store);
  app.config.globalProperties.$notify = Notify;
  app.config.globalProperties.$toast = Toast;
  app.config.globalProperties.$api = Api;
  app.config.globalProperties.$tools = Tools;
  app.config.globalProperties.$apiPath = ApiPath;
  return {
    app,
  };
}
