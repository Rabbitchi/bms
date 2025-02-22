<!--
 * @Author: ruanyali yali.ruan@dexintec.com
 * @Date: 2022-05-09 10:26:16
 * @LastEditors: ruanyali yali.ruan@dexintec.com
 * @LastEditTime: 2022-05-09 11:51:51
 * @FilePath: \zeusd:\project\ng-product-factory-web\src\layout\components\Sidebar\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :class="{ 'has-logo': showLogo, isCurrentModule: isCurrentModule }">
    <logo v-if="showLogo" :collapse="isCollapse" />
      <el-menu
        class="menu-parent"
        @click.native.prevent="handleclick"
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="false"
        :active-text-color="`#409EFF`"
        :collapse-transition="false"
        mode="vertical"
      >
      <!-- <el-menu-item class="menu-son"> 1</el-menu-item> -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    <!-- </el-scrollbar> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
// import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  inject:['reload'],
  data() {
    return {
       menuItems : ([
         {
           title: "debthome",
           icon: "Avatar",
           index: "/debthome",
         },
         {
           title: "Agents and Groups",
           icon: "Menu",
           index: "",
           children: [
            {
              title: "Collection Agent",
              icon: "List",
              index: "/CollectionAgent",
            },
            {
              title: "Collection Group",
              icon: "List",
              index: "/CollectionGroup",
            },
          ],
          },
          {
           title: "user",
           icon: "Avatar",
           index: "/user",
         },
         ])
       }
  },
  // $route(to, from) {
  //      window.location.reload(); //监测到路由发生跳转时刷新一次页面
  //  },
  computed: {
    ...mapGetters(['sidebar', 'currModuleName']),  
    isCurrentModule() {
      return (
        this.$route.meta.topMenuName === this.$store.state.menu.currModuleName
      )
    }, 
    routes() {
      console.log('sidebar menu', this.$store.state.user.routes, this.$route.fullPath)
      console.log('所有路由信息', this.$router.options.routes)
      return this.$router.options.routes
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set 
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse() {
      return !this.sidebar.opened
    }
    // updated: function() {
    //   // 判断是否仅有一个菜单
    //   let isOnlyRouter = this.routes.length === 1;
    //   let visibleChildren = this.routes[0].children.filter(item => {
    //     return item.hidden !== true;
    //   });
    //   // 菜单下是否只有一个可见的子菜单
    //   let isVisibleChildren = visibleChildren.length === 1;
    //   // 都是的话就跳转
    //   if (isOnlyRouter && isVisibleChildren) {
    //     let path = this.routes[0].path + "/" + visibleChildren[0].path;
    //     this.$router.push(path)
    //   }
    // }
  
  },
  methods: {
    handleclick(e){
      // if(e.target.dataset.id == 1) {
      //   console.log('e',e.target.dataset.id, this.$router);
      //   this.$router.push({ path: '/newpage'}, () => {})
      // } else {
      //   console.log('e1',e.target.dataset.id);
      //   this.$router.push({ path: '/audit-management'}, () => {})
      // }
    },
    handleOpen(key, keyPath) {
        console.log('key@keypath',key, keyPath);
    },
    handleClose(key, keyPath) {
       console.log(key, keyPath);
    }
  },
  mounted() {
    this.reload()
  }
}
</script>
<style lang="scss" scoped>
//scoped 用来限制当前样式只在当前页面中有用，在其子组件中无用
// /deep/该样式也同样用在其子组件中
/deep/ .el-menu-item,
/deep/.el-submenu__title {
  color: #bfcbd9;
}
.menu-son {
  font-size: 22px;
  color: aqua;
}
</style>
