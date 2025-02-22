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
      <template slot="logo" slot-scope="scope">
        <img
          :src="scope.row.img_url"
          alt=""
          :style="{ height: '50px', width: '50px' }"
        />
      </template>
      <!-- <template slot="product_grade" slot-scope="scope">
        <span>{{ scope.row.product_grade | formatGrade }}</span>
      </template> -->
      <template slot="recall_rule_code" slot-scope="scope">
        <span>{{ scope.row.recall_rule_code | formatRule }}</span>
      </template>
      <template slot="status" slot-scope="scope">
        <span
          :style="{ color: scope.row.status === 1 ? '#67C23A' : '#F56C6C' }"
        >
          {{ scope.row.status | formatStatus }}
        </span>
      </template>
      <template slot="operation" slot-scope="scope">
        <span @click="operateShelf(scope.row)" class="operate-btn">
          {{ scope.row.status === 1 ? '下' : '上' }}架
        </span>
        <span
          @click="editProduct(scope.row)"
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
import {
  getProductList,
  publishProduct,
  getPromoterList
} from '@/api/manage/productManage'
export default {
  name: 'ProductList',
  components: { searchForm, tableTemplate },
  data() {
    return {
      loading: false,
      form_data: {
        product_name: '',
        company: '',
        product_type: '',
        status: 0,
        promoter_aid: '',
        date: ''
      },
      searchConfig: [
        {
          label: '产品名称',
          prop: 'product_name',
          type: 'input',
          style: {
            width: '200px'
          }
        },
        // {
        //   label: '产品类别',
        //   prop: 'product_grade',
        //   type: 'select',
        //   style: {
        //     width: '200px'
        //   },
        //   options: [
        //     { label: '一类', value: 1 },
        //     { label: '二类', value: 2 },
        //     { label: '三类', value: 3 },
        //     { label: '四类', value: 4 }
        //   ]
        // },
        {
          label: '规则编码',
          prop: 'recall_rule_code',
          type: 'select',
          style: {
            width: '200px'
          },
          options: [
            { label: '000', value: 1 },
            { label: '001', value: 2 },
            { label: '002', value: 3 },
            { label: '003', value: 4 },
            { label: '004', value: 5 },
            { label: '005', value: 6 }
          ]
        },
        {
          label: '公司名称',
          prop: 'company',
          type: 'input',
          style: {
            width: '200px'
          }
        },
        {
          label: '类型',
          prop: 'product_type',
          placeholder: '请选择',
          type: 'select',
          style: {
            width: '150px'
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
            width: '200px'
          },
          options: []
        },
        {
          label: '状态',
          prop: 'status',
          placeholder: '请选择',
          type: 'select',
          style: {
            width: '150px'
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
      handlerBtnConfig: [
        {
          label: '新增',
          type: 'primary',
          round: false,
          icon: 'el-icon-plus',
          handler: () => {
            this.createProduct()
          }
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
          // {
          //   label: '产品类别',
          //   prop: 'product_grade',
          //   align: 'center',
          //   type: 'slot',
          //   slotName: 'product_grade'
          // },
          {
            label: '规则编码',
            prop: 'recall_rule_code',
            align: 'center',
            type: 'slot',
            slotName: 'recall_rule_code'
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
            label: '最高可借',
            prop: 'max_loan_amount',
            align: 'center'
          },
          {
            label: '简介',
            prop: 'intro',
            align: 'center'
          },
          {
            label: '公司名称',
            prop: 'company',
            align: 'center'
          },
          {
            label: '发布渠道',
            prop: 'publish_channels_display',
            align: 'center'
          },
          {
            label: '推广员',
            prop: 'promoter_name',
            align: 'center'
          },
          {
            label: '创建人',
            prop: 'creator_name',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time_fmt',
            align: 'center',
            style: {
              'white-space': 'initial'
            }
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
            prop: 'statusText',
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
        url: '/ls-mgr-api/prod-mgr/product/list',
        pagination_config: {
          isShow: true,
          total: 0,
          page_size: 10,
          page_index: 1
        }
      },
      tableData: [],
      promoterList: []
    }
  },
  filters: {
    // formatGrade(v) {
    //   let obj = {
    //     1: '一类',
    //     2: '二类',
    //     3: '三类',
    //     4: '四类'
    //   }
    //   return obj[v]
    // },
    formatRule(v) {
      let obj = {
        '000': '000',
        '001': '001',
        '002': '002',
        '003': '003',
        '004': '004',
        '005': '005'
      }
      return obj[v]
    }
  },
  mounted() {
    this.queryProductList()
    this.queryPromoterList()
  },
  methods: {
    // 获取产品列表
    queryProductList() {
      let formData = JSON.parse(JSON.stringify(this.form_data))
      let data = {
        data: Object.assign(
          {},
          formData,
          { begin_create_time_fmt: formData.date ? formData.date[0] : '' },
          { end_create_time_fmt: formData.date ? formData.date[1] : '' },
          { page_size: this.tableConfig.pagination_config.page_size },
          { page_index: this.tableConfig.pagination_config.page_index - 1 }
        )
      }
      delete data.data.date
      this.loading = true
      getProductList(data)
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
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryProductList()
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryProductList()
    },
    // 点击查询
    search(obj) {
      this.form_data = obj
      this.tableConfig.pagination_config.page_index = 1
      this.queryProductList()
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
            this.queryProductList()
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    editProduct(row) {
      this.$router.push({
        path: 'operateProduct',
        query: { pid: row.pid }
      })
    },
    createProduct() {
      this.$router.push({
        path: 'operateProduct',
        query: { type: 'create' }
      })
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
  .el-table__cell:nth-child(12) {
    .cell.el-tooltip {
      white-space: initial;
    }
  }
}
</style>
