<!--
	作者：ganshengqu
	时间：2021-01-12
-->
<template>
  <div class="table_container">
    <div class="table_filter clearfix">
      <el-form
        ref="rateTable"
        :model="queryConditions.data"
        label-position="left"
        :inline="true"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="duedate：">
              <el-date-picker
                v-model="timeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :picker-options="pickerBeginDateBefore"
                @change="selectData"
                range-separator="~"
                start-placeholder="Start date"
                end-placeholder="End date"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="searchTable"
              >
                Query
              </el-button>
              <el-button @click.stop="resetForm" icon="el-icon-refresh">
                Reset
              </el-button>
              <el-button
                type="primary"
                @click.stop="exportExcel"
                icon="el-icon-folder-opened"
              >
                Export Excel
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-divider />

    <div class="table_list">
      <el-table
        ref="table"
        class="reset-el-table"
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="duedate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.dueDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="term" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanTerm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="interest" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interest }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="totalRecord > 0"
        :total="totalRecord"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        @pagination="getListItem()"
      />
    </div>
    <!--导出弹窗-->
    <needFieldsDialog
      :exportList="exportList"
      :setDialogStatus="true"
      :dialogShow="dialogShow"
      @cancelDailog="cancelDailog"
      :needCheckList="filterTemplateHeader"
      :filterTemplateHeader="filterTemplateHeader"
      :Filename="Filename"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import {
  receiveDetailQuery,
  receiveDetailExport
} from '@/api/frs/interest-income-receivable.js'
import needFieldsDialog from '@/components/ims/needFieldsDialog'
import { getPreDateTime } from '@/vendor/conversionTime.js'
if (process.env.NODE_ENV === 'development') {
  require('@/mock/frs.js')
}

export default {
  components: { Pagination, needFieldsDialog },
  props: {
    productType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      listLoading: false,
      totalRecord: 0,
      timeRandJumb: null,
      tableData: [],
      timeRange: [],
      Filename: '',
      queryConditions: {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        data: {
          dueDateStart: '',
          dueDateEnd: '',
          productType: this.productType
        }
      },
      exportList: [],
      dialogShow: false,
      //导出模板(默认全部导出，所以needCheckList和filterTemplateHeader数组初始值一样)
      filterTemplateHeader: [
        { name: 'productType', value: 'productType', isRequired: false },
        { name: 'dueDate', value: 'dueDate', isRequired: false },
        { name: 'interest', value: 'interest', isRequired: false },
        { name: 'loanId', value: 'loanId', isRequired: false },
        { name: 'loanTerm', value: 'loanTerm', isRequired: false }
      ],
      //时间控件修改，限制只能选同一年
      minDate: '',
      maxDate: '',
      pickerBeginDateBefore: {
        onPick: ({ maxDate, minDate }) => {
          if (minDate !== null && maxDate === null) {
            this.timeRandJumb = minDate
            this.minDate = minDate
            this.maxDate = maxDate
          } else {
            this.timeRandJumb = null
          }
        },
        disabledDate: (time) => {
          let three = 31 * 24 * 3600 * 1000
          if (this.timeRandJumb !== null) {
            return (
              time.getFullYear() <
                new Date(this.minDate.getTime()).getFullYear() ||
              time.getFullYear() >
                new Date(this.minDate.getTime()).getFullYear() ||
              time > new Date(this.minDate.getTime() + three) ||
              time < new Date(this.minDate.getTime()) ||
              time.getTime() > Date.now() ||
              time.getFullYear() <= 2019
            )
          }
          return time.getTime() > Date.now() || time.getFullYear() <= 2019
        }
      }
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {
    timeRange: function () {
      this.queryConditions.data.dueDateStart =
        this.timeRange && this.timeRange[0] ? this.timeRange[0] : ''
      this.queryConditions.data.dueDateEnd =
        this.timeRange && this.timeRange[1] ? this.timeRange[1] : ''
    }
  },
  created() {
    //如果路由带参，需要切换到对应的tab
    if (this.$route.query.productType && this.$route.query.dueDate) {
      this.timeRange.push(this.$route.query.dueDate)
      this.timeRange.push(this.$route.query.dueDate)
      this.getListItem()
    } else {
      //如果是直接点击菜单进入（路由没有带参数），则取当前时间的前一天
      this.timeRange.push(getPreDateTime())
      this.timeRange.push(getPreDateTime())
      this.getListItem()
    }
  },
  mounted() {},
  methods: {
    //时间控件，限制只能选同一年
    selectData() {
      if (this.timeRandJumb !== null) {
        this.minDate = ''
        this.maxDate = ''
        let three = 31 * 24 * 3600 * 1000
        this.pickerBeginDateBefore = {
          disabledDate: (time) => {
            if (this.minDate) {
              return (
                time.getFullYear() <
                  new Date(this.minDate.getTime()).getFullYear() ||
                time.getFullYear() >
                  new Date(this.minDate.getTime()).getFullYear() ||
                time > new Date(this.minDate.getTime() + three) ||
                time < new Date(this.minDate.getTime()) ||
                time.getTime() > Date.now() ||
                time.getFullYear() <= 2019
              )
            }
            return time.getTime() > Date.now() || time.getFullYear() <= 2019
          }
        }
      }
    },
    exportExcel() {
      let _this = this
      // 改为全局遮罩, 避免接口返回之前切换标签导致出现无法关闭的遮罩
      const loading = _this.$loading({
        lock: true,
        text: 'Loading Export Data...',
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.5)'
      })
      // 导出
      receiveDetailExport(_this.queryConditions)
        .then((res) => {
          if (res.data.status.code === 0) {
            loading.close()
            //没有导出数据时，toast提示
            if (res.data.data.length === 0) {
              _this.$message({
                message: 'Export data is empty',
                type: 'warning'
              })
              return false
            }
            _this.exportList = res.data.data
            //文件名
            _this.Filename =
              'Interest Income Receivable Details' +
              '(' +
              _this.productType +
              ')' +
              _this.queryConditions.data.dueDateStart +
              '~' +
              _this.queryConditions.data.dueDateEnd
            _this.dialogShow = true
          } else {
            _this.$message.error(res.data.status.msg)
          }
        })
        .catch((e) => {
          loading.close()
        })
    },
    cancelDailog() {
      this.dialogShow = false
    },
    getListItem() {
      let _this = this
      _this.listLoading = true
      // 分页逻辑
      receiveDetailQuery(_this.queryConditions)
        .then((res) => {
          _this.tableData = res.data
          _this.totalRecord = res.page.totalRecord
          _this.listLoading = false
        })
        .catch((e) => {
          _this.listLoading = false
        })
    },
    searchTable() {
      this.queryConditions.page.pageNum = 1
      this.getListItem()
    },
    resetForm() {
      this.timeRange = []
      this.timeRandJumb = null
    }
  }
}
</script>

<style scoped lang="scss">
.table_container {
  background: #ffffff;
  padding: 40px 0px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  .table_list {
    margin-top: 20px;
  }
  /deep/ .el-divider--horizontal {
    margin-top: 14px;
  }
  .queryForm {
    text-align: left;
    margin-left: -20px;
    margin-right: -20px;
    margin-top: 0;
    display: flex;
    flex-wrap: wrap;
    .el-form-item__label {
      text-indent: 20px;
    }
  }
  /deep/ .el-date-editor .el-range-separator {
    width: 27px;
  }
}
</style>
