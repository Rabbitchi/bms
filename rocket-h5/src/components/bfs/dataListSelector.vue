<template>
  <el-dialog
    :title="`选择客户名单`"
    :visible.sync="showDialogBatchNo"
    @open="queryData"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="60vw"
    top="100px"
  >
    <div class="riskInformation">
      <el-table
        ref="table"
        v-loading="listLoading"
        class="table"
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        :fit="true"
        border
        empty-text
        max-height="400"
      >
        <el-table-column label="选择" width="55" align="center">
          <template slot-scope="scope">
            <el-radio
              :disabled="scope.row.status === 'N'"
              v-model="scope.row.checked"
              :label="scope.row.batchNo"
            ></el-radio>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="batchNo" label="数据批次">
          batchNo,createTime,status
          <template slot-scope="scope">
            <span>{{ scope.row.batchNo }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="createTime"
          label="生成时间"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="status"
          label="同步完成"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        :pageSizes="[10, 20, 30, 50, 100, 1000]"
        @pagination="queryData()"
      /> -->
    </div>
    <div class="btn_wrapper">
      <el-button type="primary" class="closeBtn" @click="closeDialog">
        关闭
      </el-button>
      <el-button type="primary" class="closeBtn" @click="submitInfo">
        提交
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import { getBatchList } from '@/api/bfs/letterManagement'
// import Pagination from "@/components/Pagination";

export default {
  name: 'StragetySelector',
  components: {
    // Pagination,
    getBatchList
  },
  props: {
    showDialogBatchNo: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productList: [],
      listLoading: false,
      loading: false,
      total: 0,
      tableData: [
        // {
        //   batchNo: "1",
        //   createTime: "短信模板分类1",
        //   status: "Y"
        // },
        // {
        //   batchNo: "2",
        //   createTime: "短信模板分类1",
        //   status: "Y"
        // },
        // {
        //   batchNo: "3",
        //   createTime: "短信模板分类1",
        //   status: "N"
        // }
      ],
      // queryConditions: {
      //   page: {
      //     pageNum: 1,
      //     pageSize: 1000
      //   },
      //   data: {
      //     name: "",
      //     product: [],
      //     couponName: "",
      //     couponMethod: []
      //   }
      // },
      currentRow: {}
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialogBatchNo', false)
    },
    submitInfo() {
      console.log(this.currentRow)
      if (!this.currentRow.status) {
        this.$message.error('请选择批次后再进行提交！')
        return false
      }
      if (this.currentRow.status === 'N') {
        this.$message.error('该批次未同步完成！请重新选择同步完成的数据批次！')
        return false
      }
      console.log(this.currentRow)
      this.$emit('selectBatch', this.currentRow)
      this.closeDialog()
    },
    queryData: function () {
      // this.getListItem(this.queryConditions);
      getBatchList()
        .then((res) => {
          this.tableData = res.data
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    // 单选
    handleCurrentChange(val) {
      if (val && val.batchNo) {
        this.tableData.forEach((item) => {
          // 排他,每次选择时把其他选项都清除
          if (item.batchNo === val.batchNo) {
            item.checked = val.batchNo
          } else {
            item.checked = false
          }
        })
      }
      //清空 currentRow
      Object.assign(this.currentRow, val)
    }
  }
}
</script>

<style scoped lang="scss">
.btn_wrapper {
  text-align: right;
  padding: 10px 0;
}

::v-deep .el-dialog__body {
  padding: 5px 30px;
}
::v-deep th,
::v-deep td {
  padding: 6px 0;
}

::v-deep .el-form-item {
  margin: 0;
}
.table {
  /deep/ .el-radio__label {
    display: none;
  }
}
</style>
