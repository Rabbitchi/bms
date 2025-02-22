<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive :include="cachedViews" v-if="cachedViews.length > 0"> -->
        <router-view :key="key"  class="app-main-item"/>
      <!-- </keep-alive> -->
    </transition>
    <el-backtop target=".app-main" :bottom="150"></el-backtop>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      console.log('path-route', this.$route.fullPath, this.$store.state.tagsView.cachedViews.length, this.$store.state.tagsView);
      return this.$route.fullPath
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
  background: #e9e8e8; 
}
.app-main-item {
  // padding: 18px;
  min-height: calc(100vh - 100px);
  // box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.2);
  width: 100%;
  // background: #fff;
}
.fixed-header + .app-main {
  padding-top: 50px;
  height: 100vh;
  overflow: auto;
}
.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding: 65px 25px 0 25px;
  }
}
</style>
