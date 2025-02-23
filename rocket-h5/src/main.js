import Vue from 'vue' // 引入Vue库
import App from './App.vue' // 引入根组件App.vue

// 引入normalize.css以提供一个现代的CSS重置方案
import 'normalize.css/normalize.css' 
// 引入ElementUI组件库
import ElementUI from 'element-ui'

// 引入自定义的重置CSS文件
import '@/assets/css/reset.css'
// 引入ElementUI的默认主题样式
import 'element-ui/lib/theme-chalk/index.css'

// 引入ElementUI的英文语言包，用于国际化支持
import locale from 'element-ui/lib/locale/lang/en' 

// 下面这一行是注释掉的全局样式文件引入，可以根据需要取消注释
// import '@/styles/index.scss' // 全局CSS样式

// 引入Vuex状态管理库的store实例
import store from './store'
// 引入Vue Router路由实例
import router from './router'
// 引入Vue Router库
import VueRouter from 'vue-router';

// 引入自定义的图标组件
import '@/icons' 
// 引入权限控制模块
import '@/permission' 
// 引入防抖和节流函数文件
import { debounce, throttle } from './utils/dbucTrtl.js';

// 设置Vue的生产提示开关为false，避免在生产环境中显示不必要的警告信息
Vue.config.productionTip = false

// 如果环境变量VUE_APP_MOCK为真且当前环境为开发环境，则引入mock模块
if (process.env.VUE_APP_MOCK && process.env.NODE_ENV === 'development') {
    require('@/mock')
}

// 引入自定义的过滤器模块
import vueFilter from '@/utils/filter'
// 遍历过滤器模块中的所有过滤器，并将它们注册到Vue实例上
for (let key in vueFilter) {
    Vue.filter(key, vueFilter[key])
}

// 使用ElementUI组件库，并传入语言配置
Vue.use(ElementUI, {
    locale
})
// 使用Vue Router插件
Vue.use(VueRouter)

// 创建一个新的Vue实例，并将store和router注入其中，同时指定渲染根组件App.vue
new Vue({
        store,
        router,
        render: (h) => h(App)
    }).$mount('#app')

// 在Vue原型上扩展两个全局方法$debounce和$throttle，方便在所有Vue组件中调用防抖和节流函数
Vue.prototype.$debounce = debounce;
Vue.prototype.$throttle = throttle;
