<template>
  <div
    class="card_wrapper"
    :style="'background: url(' + background + ') no-repeat center/100% 100%;'"
    @click="handleClick"
  >
    <div class="number">{{ number }}</div>
    <div class="type">Number of {{ type }}</div>
  </div>
</template>

<style lang="scss">
.card_wrapper {
  width: 32%;
  height: 136px;
  margin-bottom: 20px;
  color: #fff;
  padding: 24px 0 20px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 8px;

  .number {
    font-family: Avenir-Medium;
    font-size: 60px;
    height: 72px;
    line-height: 72px;
    letter-spacing: 0;
    font-weight: 800;
    text-align: center;
  }
  .type {
    font-family: Avenir-Medium;
    font-size: 18px;
    text-align: center;
    line-height: 22px;
    letter-spacing: 0;
  }
}
</style>

<script>
import card_bg1 from '../assets/image/card_bg1.png'
import card_bg2 from '../assets/image/card_bg2.png'
import card_bg3 from '../assets/image/card_bg3.png'

export default {
  props: {
    type: String,
    number: Number
  },

  computed: {
    background() {
      switch (this.type) {
        case 'assign':
          return card_bg1
        case 'completed':
          return card_bg2
        case 'PTP':
          return card_bg3
        default:
          return card_bg1
      }
    }
  },

  methods: {
    handleClick: function () {
      this.$emit('tap', this.type)
    }
  }
}
</script>
