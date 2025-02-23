<template>
  <!-- 根元素，根据主题动态绑定 class -->
  <div id="app" :class="['theme_' + theme]">
    <!-- 使用 keep-alive 缓存路由组件，key 用于强制更新缓存 -->
    <keep-alive :key="key">
      <!-- 路由视图，isRouterAlive 控制是否显示 -->
      <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  // 通过 provide 提供变量，子组件通过 inject 注入
  provide () {                                             
    return {
        reload: this.reload // 提供 reload 方法，用于刷新路由视图                              
    }
  },
  data() {
    return{
        isRouterAlive: true // 控制路由视图是否显示的变量
    }
  },
  components: {},
  computed: {
    // 从 Vuex 中获取主题 theme
    ...mapState({
      theme: (state) => state.app.theme
    }),
    // 计算 key 值，用于强制更新 keep-alive 缓存的组件
    key() {
     return this.$route.name !== 'underfined' ?  this.$route.name + new Date() : this .$route + new Date()
    } 
  },
  methods: {
     // 刷新路由视图的方法
     reload () {
         this.isRouterAlive = false; // 先关闭路由视图
         this.$nextTick(function () {
             this.isRouterAlive = true; // 再打开路由视图
             console.log('reload执行了一次'); // 打印日志
         }) 
     }
 },
  created(){
    // 组件创建时，打印当前路由路径
    console.log('当前的路由', this.$route.fullPath);
  }
}
</script>
