<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 展示当前姓名和角色 -->
      <!-- <span class="menu-name">{{ name }} @ {{ currRoleName }}</span> -->
      <el-dropdown
        type="text"
        class="avatar-container"
        trigger="hover"
        :split-button="false"
      >
        <el-button type="text" class="menu-name">
          {{ name }} | {{ currRoleName }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <!-- <div class="avatar-wrapper">
          <img src="@/assets/image/hi.gif" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>-->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item class="roleDropdown">
              <i class="el-icon-s-home"></i>
              HOME
            </el-dropdown-item>
          </router-link>
          <!-- <router-link to="/user/userInfo">
            <el-dropdown-item class="roleDropdown" divided>
              <i class="el-icon-user-solid"></i>
              USER INFO
            </el-dropdown-item>
          </router-link> -->
          <!-- <el-dropdown-item class="roleDropdown" divided disabled>
            <i class="el-icon-refresh"></i>
            <em>Change Role</em>
          </el-dropdown-item> -->
          <el-dropdown-item
            class="roleDropdown"
            v-for="item in roleList"
            :key="item.roleId"
          >
            <span
              :class="{ isCurrRole: currRoleId === item.roleId }"
              style="display: inline-block; width: 100%"
              @click="switchCurrRole(item.roleId, item.roleName)"
            >
              <i class="el-icon-user" />
              {{ item.roleName }}
            </span>
          </el-dropdown-item>
          <el-dropdown-item class="roleDropdown" divided>
            <span style="display: block" @click="logout">
              <i class="el-icon-upload2"></i>
              Log Out
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 模块菜单列表 -->
    <!-- <div class="moduleNameClass">
      <el-button
        v-for="(item,index) in moduleNameList"
        :key="index"
        @click="switchModule(item)"
        :type="item===currModuleName?'primary':''"
      >{{ item }}</el-button>
    </div>-->

    <!-- <el-dropdown type="primary" class="moduleNameClass" @command="switchModule">
      <el-button type="primary" size="small">
        <i class="el-icon-folder-opened"></i>
        {{ currModuleName }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in moduleNameList"
          :key="index"
          :command="item"
          class="moduleNameDropdown"
        >
          <i class="el-icon-s-unfold"></i>
          {{ item }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown> -->

    <p class="moduleNameClass">{{ noonTip }},</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { switchRole } from "@/api/bas/role";
import { redirectTable } from "@/router/redirectTable";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  data() {
    return {
      noonTip: "",
    };
  },
  computed: {
    ...mapGetters(["sidebar", "moduleNameList", "currModuleName", "name"]),
    roleList() {
      return this.$store.state.user.roleList;
    },
    currRoleId() {
      return this.$store.state.user.currRoleId;
    },
    currRoleName() {
      let _this = this;
      let arr = _this.$store.state.user.roleList.filter((obj) => {
        return obj.roleId === _this.$store.state.user.currRoleId;
      });
      return arr[0] ? arr[0]["roleName"] : "";
    },
    visitedViews() {
      return this.$store.getters.visitedViews;
    },
  },
  created() {
    this.myNoonTip();
  },
  methods: {
    switchCurrRole(id, name) {
      let _this = this;
      if (id === _this.currRoleId) {
        // 角色一样就不切换了8
        _this.$message({
          message: "You are " + _this.currRoleName + " now!",
          duration: 3000,
          center: true,
        });
        return;
      }
      switchRole({
        roleId: id,
        roleName: name,
      }).then((response) => {
        if (response.status.code === 0) {
          let newToken = response.data;
          _this.$message({
            message: "Switch Role Successful!",
            type: "success",
            duration: 3000,
            center: true,
          });
          _this.$store.dispatch("user/loginFromToken", newToken);
          _this.$store.dispatch("user/getLoginUserInfo", response); //生成新权限列表
          _this.$store.dispatch("menu/generateRoutes", newToken); //生成新路由
          _this.$store.dispatch("tagsView/delAllViews"); //删除当前所有页面，避免权限冲突问题
          _this.$router.push("/"); //跳转首页
        } else {
          _this.$message.error(response.status.msg);
        }
      });
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      //  清除掉不需要缓存掉详情页面
      if (this.visitedViews.length) {
        this.visitedViews.map((item) => {
          if (redirectTable[item.path]) {
            this.$store.dispatch("tagsView/delView", item);
          }
        });
      }
      //清除本地的 ukfToken
      localStorage.removeItem("ukfToken");
      // 清空所有LocalStorage数据
      localStorage.clear();
      this.$router.push(`/login`);
    },
    switchModule(moduleName) {
      if (
        this.$store.state.app.sidebar &&
        this.$store.state.app.sidebar.opened === false
      ) {
        this.toggleSideBar();
      }
      this.$store.dispatch("menu/switchModule", moduleName);
    },
    myNoonTip() {
      const that = this;
      const date = new Date();
      const hour = date.getHours();
      if (hour >= 0 && hour < 12) {
        that.noonTip = "Good morning";
      } else if (hour === 12) {
        that.noonTip = "Good afternoon";
      } else if (hour > 12 && hour < 18) {
        that.noonTip = "Good afternoon";
      } else {
        that.noonTip = "Good evening";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dropdown-menu__item--divided {
  margin-top: 0;
}
/deep/ .isCurrRole {
  color: #409eff;
}
.moduleNameDropdown.el-dropdown-menu__item,
.roleDropdown.el-dropdown-menu__item {
  font-size: 13px;
  padding: 9 15px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .moduleNameClass {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 6px;
  }

  .right-menu {
    float: right;
    height: 100%;

    .menu-name {
      display: inline-block;
      font-size: 14px;
      vertical-align: top;
      line-height: 50px;
      padding: 0;
      text-transform: uppercase;
      color: black;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 20px;
      line-height: 50px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          border-radius: 10px;
          margin-top: 4px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
