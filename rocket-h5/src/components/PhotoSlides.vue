<template>
  <div
    class="imageGallery"
    v-if="images.length"
    :style="{ width: slidesWidth, 'min-height': slidesMinHeight }"
  >
    <el-button
      class="btn caretBtn caretBtnLeft"
      type="primary"
      icon="el-icon-caret-left"
      @click="imageGroupIndex--"
      v-if="imageGroupIndex !== 0"
    ></el-button>
    <el-image
      v-for="(i, index) in imageGroups[imageGroupIndex]"
      :preview-src-list="images"
      :key="index"
      :src="i"
      fit="contain"
      :style="{ width: imageWidth, height: imageHeight }"
    >
      <div slot="placeholder" class="image-slot placeholder-image-slot"></div>
      <div
        slot="error"
        class="image-slot error-image-slot"
        :style="{ width: imageWidth, height: imageHeight }"
      >
        <img
          :style="{ width: '84px', height: '76px' }"
          src="@/assets/image/ic_photo_failed.png"
          alt
        />
      </div>
    </el-image>
    <el-button
      class="btn caretBtn caretBtnRight"
      type="primary"
      icon="el-icon-caret-right"
      @click="imageGroupIndex++"
      v-if="imageGroupIndex !== imageGroups.length - 1"
    ></el-button>
  </div>
</template>

<script>
export default {
  name: 'PhotoSlides',
  props: {
    imageWidth: {
      type: String,
      default: '172px'
    },
    imageHeight: {
      type: String,
      default: '230px'
    },

    // 外层大小
    slidesMinHeight: {
      type: String,
      default: '200px'
    },
    // 外层宽度
    slidesWidth: {
      type: String,
      default: 'auto'
    },
    // 要展示的图片
    images: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    // 每行个数
    rowLimit: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      imageGroupIndex: 0
    }
  },
  computed: {
    imageGroups() {
      let result = []
      for (let i = 0, len = this.images.length; i < len; i += this.rowLimit) {
        result.push(this.images.slice(i, i + this.rowLimit))
      }
      return result
    }
  }
}
</script>

<style scoped lang="scss">
.imageGallery {
  margin: 0 auto 40px;
  display: flex;
  justify-content: space-around;
  ::selection {
    background: transparent;
  }
  ::-moz-selection {
    background: transparent;
  }
  .caretBtn {
    position: absolute;
    border-radius: 50%;
    background: #ebedf4;
    width: 30px;
    height: 30px;
    border: none;
    color: #000;
    line-height: 30px;
    text-align: center;
    top: 50%;
    font-size: 22px;
    overflow: hidden;
    padding: 0;
    vertical-align: middle;
    line-height: 30px;
    margin-top: -35px;
    &:hover {
      color: #409eff;
    }
    &.caretBtnRight {
      right: 0;
    }
    &.caretBtnLeft {
      left: 0;
    }
  }
  .el-image {
    flex: 1;
    margin: 20px;
  }
  .placeholder-image-slot {
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .error-image-slot {
    background: #ebebeb;
    border-radius: 4px;
    position: relative;
    img {
      margin: auto;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      position: absolute;
    }
  }
}
</style>
