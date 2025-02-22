<template>
  <el-dialog
    top="0"
    class="dialog__container"
    custom-class="dialog"
    :visible="visible"
    @close="$emit('update:visible', false)"
  >
    <el-image
      ref="image"
      class="image"
      fit="contain"
      :style="`transform: rotate(${rotate}deg);width: ${imageWidth};height: ${imageHeight};`"
      :src="src"
    />
    <button
      class="image__controller el-icon-refresh-right"
      @click.prevent="rotateImage"
    />
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    src: {
      type: String
    }
  },
  data() {
    return {
      rotate: 0,
      imageWidth: '50vw',
      imageHeight: 'calc(100vh - 90px)'
    }
  },
  methods: {
    rotateImage: function () {
      this.rotate += 90
      this.imageWidth =
        this.imageWidth === 'calc(100vh - 90px)' ? '50vw' : 'calc(100vh - 90px)'
      this.imageHeight =
        this.imageHeight === 'calc(100vh - 90px)'
          ? '50vw'
          : 'calc(100vh - 90px)'
    }
  }
}
</script>

<style lang="scss">
.dialog__container {
  max-height: 100vh;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  .dialog {
    max-height: 100vh;
    .el-dialog__body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
    .image {
      transform-origin: center;
      height: calc(100vh - 90px);
    }
    .image__controller {
      position: fixed;
      top: calc(50% - 40px);
      font-size: 80px;
      right: 10vw;
      z-index: 2001;
      border-radius: 50%;
      border: transparent;
      cursor: pointer;
      outline: none;
      background-color: rgba($color: #000000, $alpha: 0.1);
    }
  }
}
</style>
