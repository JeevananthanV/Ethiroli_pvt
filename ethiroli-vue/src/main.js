import { createApp } from 'vue'
import './assets/css/global.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.mount('#root')
