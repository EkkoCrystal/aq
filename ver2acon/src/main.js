import Vue from 'vue'
import axios from 'axios'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import locale from 'element-ui/lib/locale/lang/zh-CN'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
// import echarts from 'echarts'
import * as echarts from 'echarts'
import Print from 'vue-print-nb'
import BaiduMap from 'vue-baidu-map'

Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'Awi6xxPZROVqirLfdhkNP95gnk8HC0eY'
})
import Vant from 'vant'
import 'vant/lib/index.css'
Vue.use(Vant)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

Vue.use(Print)
axios.get('/project.config.json').then((result) => {
  Vue.prototype.$baseConfig = result.data
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)

  })
}).catch((error) => {
  console.log('get baseConfig error...' + error)
})
