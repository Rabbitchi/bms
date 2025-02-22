/*
 * @FilePath: \zeusd:\project\ng-product-factory-web\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'
import App from './App.vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'

import '@/assets/css/reset.css'
import 'element-ui/lib/theme-chalk/index.css'

import locale from 'element-ui/lib/locale/lang/en' // lang i18n

// import '@/styles/index.scss' // global css

import store from './store'
import router from './router'
import VueRouter from 'vue-router';

import '@/icons' // icon
import '@/permission' // permission control
// 引入防抖节流函数文件
import { debounce, throttle } from './utils/dbucTrtl.js';


Vue.config.productionTip = false

if (process.env.VUE_APP_MOCK && process.env.NODE_ENV === 'development') {
    require('@/mock')
}


import vueFilter from '@/utils/filter'
for (let key in vueFilter) {
    Vue.filter(key, vueFilter[key])
}

Vue.use(ElementUI, {
    locale
})
Vue.use(VueRouter)
new Vue({
        store,
        router,
        render: (h) => h(App)
    }).$mount('#app')
    // 在Vue实例上扩展全局方法
Vue.prototype.$debounce = debounce;
Vue.prototype.$throttle = throttle;