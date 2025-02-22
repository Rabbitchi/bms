<template>
  <div v-if="!item.hidden" class="menu-wrapper">
    <!-- <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <i class="el-icon-menu"></i>
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template> -->
    <el-submenu
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <i class="el-icon-location"></i>
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <!-- <sidebar-item
        v-for="child in constantRoutes"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      /> -->
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";
import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";
// import constantRoutes from "./constantRoutes";

export default {
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    this.onlyOneChild = null;
    return {
      filteredChildren: [],
      // premenus:[]
    };
  },
  methods: {
    // filterChildren() {
    //   // const userPermissions = localStorage.getItem("userPermissions");
    //   const userPermissions = localStorage.getItem("userPermissions")||[
    //     "订单管理"
    //   ];
    //   const getusermenus = userPermissions ? userPermissions.split(",") : [];
      
    //   this.premenus = this.item.children;
    //   if (this.premenus && this.premenus.length > 0 ) {
    //     const filteredRoutes = this.premenus.filter((route, index) => {
    //       if (route.meta && route.meta.title) {
    //         return getusermenus.includes(route.meta.title);
    //       }
    //     });
    //     this.filteredChildren = filteredRoutes;
    //   }
    // },
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      });
   

      if (showingChildren.length === 1) {
        return true;
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        return true;
      }
      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
  },
  mounted() {
    // this.filterChildren();
  },
};
</script>
