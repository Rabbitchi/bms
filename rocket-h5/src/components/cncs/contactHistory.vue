<!--
	作者：ganshengqu
	时间：2019-11-22
	描述：cncs点击history的弹出框
	路径： import ContactHistory from '@/components/cncs/contactHistory.vue';
-->
<template>
  <div class="contact-history" v-if="historyShow">
    <!--遮罩层-->
    <div class="mask" @click="closeBox"></div>
    <div class="table__wrapper">
      <el-table
        max-height="522px"
        :data="changeRecordList"
        stripe
        style="width: 100%"
      >
        <el-table-column
          prop="updateTime"
          label="Modify Date"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="collectorId"
          label="Collector ID"
          width="170"
        ></el-table-column>
        <el-table-column
          prop="collectorName"
          label="Collector Name"
        ></el-table-column>
        <el-table-column prop="validStatus" label="Status"></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page="pageNum"
        :limit="pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<style lang="scss">
.contact-history {
  width: 100%;
  min-height: 100vh;
  position: relative;
  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 2000;
    opacity: 0.5;
    background: #000000;
  }
  .table__wrapper {
    position: fixed;
    left: calc(50% - 342px);
    width: 685px !important;
    top: 15vh;
    padding: 37px 33px 41px 33px;
    box-sizing: border-box;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    z-index: 2001;
  }
  .el-table {
    width: 685px !important;
  }
}
</style>

<script>
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  props: {
    historyShow: {
      type: Boolean,
      default: false
    },
    changeRecordList: {
      type: Array
    },
    total: {
      type: Number
    },
    pageNum: {
      type: Number
    },
    pageSize: {
      type: Number
    },
    data: {
      type: Object
    }
  },
  data() {
    return {}
  },
  methods: {
    closeBox() {
      this.$emit('closeHistory')
    },
    getList(page) {
      const data = {
        ...this.data,
        pageNum: page.page,
        pageSize: page.limit
      }
      this.$emit('getList', data)
    }
  }
}
</script>
