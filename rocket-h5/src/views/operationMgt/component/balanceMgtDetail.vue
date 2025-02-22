<template>
  <div>
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
    </tableTemplate>
  </div>
</template>
<script>
import searchForm from '@/components/manage/searchForm.vue'
import tableTemplate from '@/components/manage/tableTemplate.vue'
import { getChargeDetailList } from '@/api/manage/operatingManage'
export default {
  name: 'RechargeDetail',
  components: { searchForm, tableTemplate },
  data() {
    return {
      loading: false,
      form_data: {
        product_name: '',
        company: '',
        product_type: '',
        date: ''
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
          label: '操作时间',
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
            label: '充值金额',
            prop: 'recharge_amount',
            align: 'center'
          },
          {
            label: '操作人',
            prop: 'operator_name',
            align: 'center'
          },
          {
            label: '操作时间',
            prop: 'create_time_fmt',
            align: 'center'
          }
        ],
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
  created() {
    if (this.$route.query.productName) {
      let productName = this.$route.query.productName
      this.form_data.product_name = productName
    }
  },
  mounted() {
    this.queryChargeDetailList()
  },
  methods: {
    // 获取产品列表
    queryChargeDetailList() {
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
      getChargeDetailList(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            this.tableConfig.pagination_config.total = data.total || 0
            this.tableConfig.pagination_config.isShow = data.total > 0
            this.tableData = data.recharge_detail_list || []
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryChargeDetailList()
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryChargeDetailList()
    },
    // 点击查询
    search(obj) {
      this.form_data = obj
      this.tableConfig.pagination_config.page_index = 1
      this.queryChargeDetailList()
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
