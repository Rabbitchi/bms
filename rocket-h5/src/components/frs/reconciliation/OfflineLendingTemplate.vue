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
            <el-form-item label="businessDate：">
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
            <el-form-item label="loanId:" prop="loanId">
              <el-input
                v-model.number="queryConditions.data.loanId"
                autocomplete="off"
                onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
                placeholder="please enter"
              />
            </el-form-item>
            <el-form-item label="Terms:" prop="loanTerm">
              <el-select
                v-model="queryConditions.data.loanTerm"
                placeholder="please select"
              >
                <el-option label="All" value=""></el-option>
                <el-option
                  :label="item"
                  :value="item"
                  v-for="(item, index) in termList"
                  :key="index"
                ></el-option>
              </el-select>
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
        <el-table-column label="businessDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.businessDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Terms" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanTerm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="productType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="businessChannel" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.businessChannel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="interest" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interest }}</span>
          </template>
        </el-table-column>
        <el-table-column label="rate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="transactionId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="checkDetails(scope.row)"
            >
              Details
            </el-button>
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
    <!--查看details弹窗-->
    <el-dialog
      :title="'details'"
      :visible.sync="dialogDetailVisible"
      v-loading="listDetailLoading"
      width="80%"
      @close="closeDialog"
    >
      <el-table
        :data="listDetail"
        style="width: 100%"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="businessDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.businessDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="loanTerm" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.loanTerm }}</span>
          </template>
        </el-table-column>
        <el-table-column label="productType" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="businessChannel" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.businessChannel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="interest" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interest }}</span>
          </template>
        </el-table-column>
        <el-table-column label="rate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.rate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="transactionId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="transactionStatus" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.transactionStatus }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { termConfigQuery } from '@/api/frs/finance'
import {
  frsLoanSumQuery,
  frsLoanSumExport,
  frsLoanDetailQuery
} from '@/api/frs/reconciliation-finance'
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
      queryConditions: {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        data: {
          businessDateStart: '',
          businessDateEnd: '',
          loanId: null,
          loanTerm: '',
          businessChannel: '',
          productType: this.productType,
          dueDateStart: '',
          dueDateEnd: ''
        }
      },
      dialogDetailVisible: false,
      listDetailLoading: false,
      listDetail: [],
      //期数
      termList: [],
      Filename: '',
      exportList: [],
      dialogShow: false,
      //导出模板(默认全部导出，所以needCheckList和filterTemplateHeader数组初始值一样)
      filterTemplateHeader: [
        { name: 'businessDate', value: 'businessDate', isRequired: false },
        { name: 'loanId', value: 'loanId', isRequired: false },
        { name: 'Terms', value: 'loanTerm', isRequired: false },
        { name: 'productType', value: 'productType', isRequired: false },
        {
          name: 'businessChannel',
          value: 'businessChannel',
          isRequired: false
        },
        { name: 'amount', value: 'amount', isRequired: false },
        { name: 'interest', value: 'interest', isRequired: false },
        { name: 'rate', value: 'rate', isRequired: false },
        { name: 'transactionId', value: 'transactionId', isRequired: false }
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
      this.queryConditions.data.businessDateStart =
        this.timeRange && this.timeRange[0] ? this.timeRange[0] : ''
      this.queryConditions.data.businessDateEnd =
        this.timeRange && this.timeRange[1] ? this.timeRange[1] : ''
      this.queryConditions.data.dueDateStart =
        this.timeRange && this.timeRange[0] ? this.timeRange[0] : ''
      this.queryConditions.data.dueDateEnd =
        this.timeRange && this.timeRange[1] ? this.timeRange[1] : ''
    }
  },
  created() {
    ////给businessDate赋默认值
    this.timeRange.push(getPreDateTime())
    this.timeRange.push(getPreDateTime())
    this.getListItem()
  },
  mounted() {
    this.queryTermList()
  },
  methods: {
    closeDialog() {
      this.dialogDetailVisible = false
    },
    //查看详情
    checkDetails(row) {
      let _this = this
      _this.listDetailLoading = true
      _this.dialogDetailVisible = true
      let reqData = {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        data: {
          businessDateStart: _this.queryConditions.data.businessDateStart,
          businessDateEnd: _this.queryConditions.data.businessDateEnd,
          loanId: row.loanId,
          businessChannel: 'offline',
          productType: row.productType
        }
      }
      frsLoanDetailQuery(reqData)
        .then((res) => {
          _this.listDetail = res.data
          _this.listDetailLoading = false
        })
        .catch((e) => {
          _this.dialogDetailVisible = false
        })
    },
    //查询期数
    queryTermList() {
      let _this = this
      let reqData = {
        page: {
          pageNum: 1,
          pageSize: 10
        },
        data: _this.productType
      }
      termConfigQuery(reqData)
        .then((res) => {
          _this.termList = res.data
        })
        .catch((e) => {
          console.log('error')
        })
    },
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
      frsLoanSumExport(_this.queryConditions)
        .then((res) => {
          if (res.data.status.code === 0) {
            _this.exportList = res.data.data.loanSubs
            _this.Filename =
              'OfflineRelease DataDetail' +
              '(' +
              _this.productType +
              ')' +
              _this.queryConditions.data.businessDateStart +
              '~' +
              _this.queryConditions.data.businessDateEnd
            _this.dialogShow = true
            loading.close()
          } else {
            Message({
              message: res.data.status.msg || 'error',
              type: 'error',
              duration: 5 * 1000
            })
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
      frsLoanSumQuery(_this.queryConditions)
        .then((res) => {
          _this.tableData = res.data.loanSubs
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
      this.queryConditions.data.loanId = ''
      this.queryConditions.data.loanTerm = ''
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
