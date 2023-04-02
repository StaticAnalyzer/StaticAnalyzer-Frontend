import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios';

const app = createApp(App);
app.use(ElementPlus)
app.use(router)
app.mount('#app')

app.config.globalProperties.$http = axios;
axios.defaults.baseURL = '/api';
