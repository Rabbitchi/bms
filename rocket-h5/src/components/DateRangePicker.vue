<template>
  <div class="block">
    <!-- <span class="demonstration">默认</span> -->
     <el-date-picker
      v-model="selectedDate"
      style="width: 180px;"
      type="date"
      :placeholder="placeholder">
    </el-date-picker>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String, // 定义一个名为 placeholder 的 prop，并指定类型为字符串
      default: '' // 设置默认值为 'select date'
    }
  },
  data() {
    return {
      selectedDate: this.value ? this.formatDate(this.value) : '' ,
      placeholder: this.placeholder
    };
  },
  watch: {
    value(newVal) {
      this.selectedDate = newVal ? this.formatDate(newVal) : '';
    },
    selectedDate(newVal) {
      this.$emit('input', newVal);  
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  created() {
    console.log('dddd=test', this.selectedDate);
    
  }
};
</script>

<style scoped>
.elTabPane {
  /* max-height: 782px;*/
  overflow-y: auto;
}
</style>
