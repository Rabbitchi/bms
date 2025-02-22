<template>
  <div class="container">
    <searchForm
      :searchConfig="searchConfig"
      :formData.sync="form_data"
      @search="search"
    ></searchForm>
    <tableTemplate
      v-loading="loading"
      ref="SearchTable"
      :config="tableConfig"
      :tableData="tableData"
      :handlerBtnConfig="handlerBtnConfig"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <template slot="operation" slot-scope="scope">
        <span
          @click="recharge(scope.row)"
          class="operate-btn"
          :style="{ cursor: 'pointer', 'margin-right': '10px' }"
        >
          充值
        </span>
        <span @click="rechargeDetail(scope.row)" class="operate-btn">
          充值明细
        </span>
        <span
          @click="editCompany(scope.row)"
          :style="{ cursor: 'pointer', 'margin-left': '10px' }"
          class="operate-btn"
        >
          编辑
        </span>
      </template>
    </tableTemplate>

    <!-- 充值弹窗 -->
    <chargeDiolog
      :dialogShow.sync="dialogShow"
      :chargeInfo="chargeInfo"
      @updateList="queryCompanyList"
      @cancelDailog="cancelDailog"
    ></chargeDiolog>
  </div>
</template>

<script>
import searchForm from '@/components/manage/searchForm.vue'
import tableTemplate from '@/components/manage/tableTemplate.vue'
import chargeDiolog from './component/balanceRecharge.vue'
import { getCompanyList } from '@/api/manage/companyManage'
export default {
  name: 'CompanyList',
  components: { searchForm, tableTemplate, chargeDiolog },
  data() {
    return {
      loading: false,
      chargeInfo: {},
      dialogShow: false,
      form_data: {
        company_name: ''
      },
      searchConfig: [
        {
          label: '公司名称',
          prop: 'company_name',
          type: 'input',
          style: {
            width: '200px'
          }
        }
      ],
      handlerBtnConfig: [
        {
          label: '新增公司',
          type: 'primary',
          round: false,
          icon: 'el-icon-plus',
          handler: () => {
            this.createCompany()
          }
        }
      ],
      tableConfig: {
        defaultSort: { prop: 'infoId', order: 'descending' },
        thead: [
          {
            label: '公司名称',
            prop: 'company_name',
            align: 'center'
          },
          {
            label: '总充值金额',
            prop: 'total_recharge_amount',
            align: 'center',
            slotName: 'total_recharge_amount'
          },
          {
            label: '总消耗金额',
            prop: 'total_consume_amount',
            align: 'center',
            slotName: 'total_consume_amount'
          },
          { label: '余额', prop: 'remain_amount', align: 'center' },
          {
            label: '单位',
            prop: 'currency_unit',
            align: 'center'
          },
          {
            label: '余额预警值',
            prop: 'alert_remain_amount',
            align: 'center'
          },
          {
            label: '信用额度',
            prop: 'hold_remain_amount',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time_fmt',
            align: 'center'
            // style: {
            //   'white-space': 'initial'
            // }
          },
          {
            label: '最后更新人',
            prop: 'editor_name',
            align: 'center'
          },
          {
            label: '最后更新时间',
            prop: 'update_time_fmt',
            align: 'center'
          },
          {
            label: '操作',
            type: 'slot',
            slotName: 'operation',
            align: 'center',
            width: 180
          }
        ],
        url: '/ls-mgr-api/risk-mgr/company/list',
        pagination_config: {
          isShow: true,
          total: 0,
          page_size: 10,
          page_index: 1
        }
      },
      tableData: []
    }
  },
  mounted() {
    this.queryCompanyList()
  },
  methods: {
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryCompanyList()
    },
    // 获取公司列表
    queryCompanyList() {
      let formData = JSON.parse(JSON.stringify(this.form_data))
      let data = {
        data: Object.assign(
          {},
          formData,
          { page_size: this.tableConfig.pagination_config.page_size },
          { page_index: this.tableConfig.pagination_config.page_index - 1 }
        )
      }
      this.loading = true
      getCompanyList(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            this.tableConfig.pagination_config.total = data.total || 0
            this.tableConfig.pagination_config.isShow = data.total > 0
            this.tableData = data.company_list || []
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 点击查询
    search(obj) {
      this.form_data = obj
      this.tableConfig.pagination_config.page_index = 1
      this.queryCompanyList()
    },
    editCompany(row) {
      this.$router.push({
        path: 'operateCompany',
        query: { appid: row.app_id }
      })
    },
    createCompany() {
      this.$router.push({
        path: 'operateCompany',
        query: { type: 'create' }
      })
    },
    // 点击充值
    recharge(row) {
      this.chargeInfo = {
        app_id: row.app_id,
        company_name: row.company_name,
        currency_unit: row.currency_unit
      }
      this.dialogShow = true
    },
    // 充值明细
    rechargeDetail(row) {
      this.$router.push({
        path: 'rechargeDetails',
        query: {
          companyName: row.company_name
        }
      })
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryCompanyList()
    },
    cancelDailog() {
      this.dialogShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.operate-btn {
  cursor: pointer;

  &:hover {
    color: #409eff;
  }
}

::v-deep .el-table .el-table__row {
  .el-table__cell:nth-child(10),
  .el-table__cell:nth-child(8) {
    .cell.el-tooltip {
      white-space: initial;
    }
  }
}
</style>
