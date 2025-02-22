<template>
  <div id="app" :class="['theme_' + theme]">
    <keep-alive :key="key">
     <!-- <router-view /> -->
     <router-view v-if="isRouterAlive"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。                                             
    return {
        reload: this.reload                                              
    }
  },
  data() {
    return{
        isRouterAlive: true                    //控制视图是否显示的变量
    }
  },
  components: {},
  computed: {
    ...mapState({
      theme: (state) => state.app.theme
    }),
    key() {
     return this.$route.name !== 'underfined' ?  this.$route.name + new Date() : this .$route + new Date()
    } 
  },
  methods: {
     reload () {
         this.isRouterAlive = false;            //先关闭，
         this.$nextTick(function () {
             this.isRouterAlive = true;   
             console.log('reload执行了一次');      //再打开
         }) 
     }
 },
  created(){
    console.log('当前的路由', this.$route.fullPath);
  }
}


</script>

