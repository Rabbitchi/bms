<!--
	作者：ganshengqu
	时间：2019-11-30
	描述：下拉选择框组件
-->
<template>
  <div
    class="zq-drop-list"
    @mouseover="onDplOver($event)"
    @mouseout="onDplOut($event)"
  >
    <span>
      {{ dplLable }}
      <img src="@/assets/image/cncs/ic_sq.png" class="second_img" />
      <img src="@/assets/image/cncs/editor.png" class="first_img" />
    </span>
    <ul v-show="downShow" :style="isLast ? 'top: auto;bottom: 30px;' : ''">
      <li
        v-for="(item, index) in validOptions"
        :key="index"
        @click="onLiClick(index, $event)"
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.zq-drop-list {
  display: inline-block;
  min-width: 66px;
  position: relative;
  span {
    display: block;
    height: 30px;
    box-sizing: border-box;
    padding-right: 20px;
    padding-left: 10px;
    line-height: 30px;
    font-family: Avenir-Medium;
    font-size: 14px;
    color: #303133;
    letter-spacing: 0;
    text-align: center;
    background: #ffffff;
    border: 1px solid #dddfe6;
    border-radius: 4px;
    position: relative;
    cursor: pointer;
    .second_img {
      position: absolute;
      right: 0;
      top: 5px;
      width: 14px;
      height: 10px;
    }
    .first_img {
      position: absolute;
      right: 0;
      top: 13px;
      width: 14px;
      height: 10px;
    }
  }
  ul {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    border: solid 1px #f1f1f1;
    border-radius: 4px;
    overflow: hidden;
    z-index: 9999;
    width: 122px;
    li {
      list-style: none;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      box-sizing: border-box;
      padding-left: 10px;
      border-bottom: solid 1px #f1f1f1;
      background: #ffffff;
      text-align: left;
      cursor: pointer;
    }
    li:last-child {
      border-bottom: none;
    }
    li:hover {
      background: #f6f6f6;
    }
  }
}
</style>

<script>
export default {
  name: 'DropDownList',
  props: {
    value: {
      type: String,
      default: ''
    },
    isLast: {
      type: Boolean,
      default: false
    },
    validOptions: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeIndex: -1,
      //控制下拉框显示
      downShow: false
    }
  },
  computed: {
    dplLable() {
      if (this.activeIndex >= 0) {
        return this.validOptions[this.activeIndex]
      } else {
        if (!this.value) {
          return 'select'
        } else {
          return this.value
        }
      }
    }
  },
  methods: {
    onDplOver(event) {
      this.downShow = true
      // console.log(this.initValue)
    },
    onDplOut(event) {
      this.downShow = false
    },
    onLiClick(index) {
      this.activeIndex = index
      this.$emit('input', this.validOptions[index])
    }
  }
}
</script>
