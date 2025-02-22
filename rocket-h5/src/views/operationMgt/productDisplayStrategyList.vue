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
          @click="operateShelf(scope.row)"
          :style="{ cursor: 'pointer' }"
          class="operate-btn"
        >
          {{ scope.row.status === 1 ? '下' : '上' }}架
        </span>
        <span
          @click="editStrategy(scope.row)"
          :style="{ cursor: 'pointer', 'margin-left': '10px' }"
          class="operate-btn"
        >
          编辑
        </span>
      </template>
    </tableTemplate>
  </div>
</template>

<script>
import searchForm from '@/components/manage/searchForm.vue'
import tableTemplate from '@/components/manage/tableTemplate.vue'
import { getProductAdsList } from '@/api/manage/operatingManage'
import { publishProduct } from '@/api/manage/productManage'
export default {
  name: 'ProductDisplayStrategyList',
  components: { searchForm, tableTemplate },
  data() {
    return {
      loading: false,
      form_data: {
        product_name: '',
        product_type: '',
        status: 0,
        from_begin_ads_time_fmt: '',
        to_begin_ads_time_fmt: '',
        from_end_ads_time_fmt: '',
        to_end_ads_time_fmt: ''
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
          label: '开始时间:',
          prop: 'startDate',
          placeholder: '',
          type: 'datetimerange',
          format: 'yyyy-MM-dd HH:mm:ss'
        },
        {
          label: '结束时间:',
          prop: 'endDate',
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
          { label: '类型', prop: 'product_type', align: 'center' },
          {
            label: 'Logo',
            prop: 'img_url',
            align: 'center',
            type: 'slot',
            slotName: 'logo'
          },
          {
            label: '展示顺序',
            prop: 'weight',
            align: 'center'
          },
          {
            label: '本日预设UV',
            prop: 'uv_quota_per_day',
            width: 120,
            align: 'center'
            // sortable: 'custom',
          },
          {
            label: '本日UV',
            prop: 'uv_on_today',
            align: 'center'
          },
          {
            label: '单价',
            prop: 'uv_price',
            align: 'center'
          },
          {
            label: '展示开始时间',
            prop: 'begin_ads_time_fmt',
            align: 'center'
          },
          {
            label: '展示结束时间',
            prop: 'end_ads_time_fmt',
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
        url: '/ls-mgr-api/opr-mgr/product-ads/list',
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
    this.queryStrategyList()
  },
  methods: {
    // 点击查询
    search(obj) {
      this.form_data = obj
      this.queryStrategyList()
    },
    // 获取列表
    queryStrategyList() {
      let formData = JSON.parse(JSON.stringify(this.form_data))
      let data = {
        data: Object.assign({}, formData, {
          from_begin_ads_time_fmt: formData.startDate
            ? formData.startDate[0]
            : '',
          to_begin_ads_time_fmt: formData.startDate
            ? formData.startDate[1]
            : '',
          from_end_ads_time_fmt: formData.endDate ? formData.endDate[0] : '',
          to_end_ads_time_fmt: formData.endDate ? formData.endDate[1] : '',
          page_size: this.tableConfig.pagination_config.page_size,
          page_index: this.tableConfig.pagination_config.page_index - 1
        })
      }
      delete data.data.startDate
      delete data.data.endDate
      this.loading = true
      getProductAdsList(data)
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
    // 操作上/下架
    operateShelf(row) {
      let data = {
        data: {
          pid: row.pid,
          status: row.status === 1 ? 2 : 1
        }
      }
      publishProduct(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryStrategyList()
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    // 编辑
    editStrategy(row) {
      this.$router.push({
        path: 'operateDisplayStrategy',
        query: { pid: row.pid }
      })
    },
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryStrategyList()
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryStrategyList()
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

::v-deep .el-date-editor--datetimerange.el-input__inner {
  width: 400px;
}
</style>
