<template>
  <div class="container">
    <searchForm
      :searchConfig="searchConfig"
      :formData.sync="form_data"
      @search="search"
    ></searchForm>
    <tableTemplate
      ref="SearchTable"
      :config="tableConfig"
      :tableData="tableData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <template slot="logo" slot-scope="scope">
        <img
          :src="scope.row.img_url"
          alt=""
          :style="{ height: '50px', width: '50px' }"
        />
      </template>
      <template slot="status" slot-scope="scope">
        <span
          :style="{ color: scope.row.status === 1 ? '#67C23A' : '#F56C6C' }"
        >
          {{ scope.row.status | formatStatus }}
        </span>
      </template>
      <template slot="operation" slot-scope="scope">
        <span
          @click="recharge(scope.row)"
          :style="{ cursor: 'pointer' }"
          class="operate-btn"
        >
          充值
        </span>
        <span
          @click="rechargeDetail(scope.row)"
          :style="{ cursor: 'pointer', 'margin-left': '10px' }"
          class="operate-btn"
        >
          充值明细
        </span>
      </template>
    </tableTemplate>
    <!-- 充值弹窗 -->
    <chargeDiolog
      :dialogShow.sync="dialogShow"
      :chargeInfo="chargeInfo"
      @updateList="queryAmountList"
      @cancelDailog="cancelDailog"
    ></chargeDiolog>
  </div>
</template>

<script>
import searchForm from '@/components/manage/searchForm.vue'
import tableTemplate from '@/components/manage/tableTemplate.vue'
import chargeDiolog from './component/rechargeDialog.vue'
import { getProductBalanceList } from '@/api/manage/operatingManage'
import { getPromoterList } from '@/api/manage/productManage'
export default {
  name: 'Manage',
  components: { searchForm, tableTemplate, chargeDiolog },
  data() {
    return {
      chargeInfo: {},
      dialogShow: false,
      form_data: {
        product_name: '',
        company: '',
        product_type: '',
        status: 0,
        promoter_aid: '',
        date: []
      },
      searchConfig: [
        {
          label: '产品名称',
          prop: 'product_name',
          type: 'input',
          style: {
            width: '150px'
          }
        },
        {
          label: '公司名称',
          prop: 'company',
          type: 'input',
          style: {
            width: '150px'
          }
        },
        {
          label: '类型',
          prop: 'product_type',
          placeholder: '请选择',
          type: 'select',
          style: {
            width: '100px'
          },
          options: [
            { label: 'API', value: 'API' },
            { label: 'H5', value: 'H5' }
          ]
        },
        {
          label: '推广员',
          prop: 'promoter_aid',
          placeholder: '请选择',
          type: 'select',
          style: {
            width: '150px'
          },
          options: []
        },
        {
          label: '状态',
          prop: 'status',
          placeholder: '请选择',
          type: 'select',
          style: {
            width: '100px'
          },
          options: [
            { label: '全部', value: 0 },
            { label: '上架', value: 1 },
            { label: '下架', value: 2 }
          ]
        },
        {
          label: '创建时间',
          prop: 'date',
          placeholder: '',
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss'
        }
      ],
      tableConfig: {
        defaultSort: { prop: 'infoId', order: 'descending' },
        thead: [
          {
            label: '产品名称',
            prop: 'product_name',
            align: 'center'
          },
          {
            label: '公司名称',
            prop: 'company',
            align: 'center'
          },
          { label: '类型', prop: 'product_type', align: 'center' },
          {
            label: 'Logo',
            prop: 'img_url',
            align: 'center',
            type: 'slot',
            slotName: 'logo'
          },
          {
            label: '总充值金额',
            prop: 'total_recharge_amount',
            align: 'center'
          },
          {
            label: '总消耗金额',
            prop: 'total_consume_amount',
            align: 'center'
          },
          {
            label: '余额',
            prop: 'remain_amount',
            align: 'center'
          },
          {
            label: '推广员',
            prop: 'promoter_name',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time_fmt',
            align: 'center'
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
            label: '状态',
            prop: 'status',
            align: 'center',
            type: 'slot',
            slotName: 'status'
          },
          {
            label: '操作',
            type: 'slot',
            slotName: 'operation',
            align: 'center'
          }
        ],
        url: '/ls-mgr-api/opr-mgr/product-balance/list',
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
    this.queryAmountList()
    this.queryPromoterList()
  },
  methods: {
    // 点击查询
    search(obj) {
      this.form_data = obj
      this.queryAmountList()
    },
    queryAmountList() {
      let formData = JSON.parse(JSON.stringify(this.form_data))
      let data = {
        data: Object.assign({}, formData, {
          begin_create_time_fmt: formData.date ? formData.date[0] : '',
          end_create_time_fmt: formData.date ? formData.date[1] : '',
          page_size: this.tableConfig.pagination_config.page_size,
          page_index: this.tableConfig.pagination_config.page_index - 1
        })
      }
      delete data.data.date
      this.loading = true
      getProductBalanceList(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            this.tableConfig.pagination_config.total = data.total || 0
            this.tableConfig.pagination_config.isShow = data.total > 0
            this.tableData = data.product_list || []
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 获取推广员列表
    queryPromoterList() {
      getPromoterList()
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            let arr = [{ admin_name: '全部', aid: 0 }, ...data.promoters]
            arr.map((el) => {
              el.label = el.admin_name
              el.value = el.aid
            })
            let idItem = this.searchConfig.find(
              (el) => el.prop === 'promoter_aid'
            )
            if (idItem) {
              this.$set(idItem, 'options', arr || [])
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 点击充值
    recharge(row) {
      this.chargeInfo = {
        pid: row.pid,
        company: row.company,
        product_name: row.product_name,
        img_url: row.img_url
      }
      this.dialogShow = true
    },
    // 充值明细
    rechargeDetail(row) {
      this.$router.push({
        path: 'balanceMgtDetail',
        query: {
          productName: row.product_name
        }
      })
    },
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryAmountList()
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryAmountList()
    },
    cancelDailog() {
      this.dialogShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.operate-btn {
  &:hover {
    color: #409eff;
  }
}

::v-deep .el-table .cell.el-tooltip {
  white-space: initial;
}
</style>
