/* * @Author: xiang.liu * @Date: 2021-06-04 14:45:15 * @Last Modified by:
xiang.liu * @Last Modified time: 2021-06-16 18:38:50 */

<template>
  <el-dialog
    :title="`选择 ${stragetyType} 模板`"
    :visible.sync="showDialog"
    @open="queryData"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    width="60vw"
    top="100px"
  >
    <div class="riskInformation">
      <el-form
        ref="StragetySelectorForm"
        :model="queryConditions.data"
        label-position="left"
        label-width="100px"
        class="queryForm"
      >
        <el-row :gutter="30">
          <template v-if="stragetyType === 'COUPON'">
            <el-col :span="8" :xs="24">
              <el-form-item label="优惠券名称:" prop="couponName">
                <el-input
                  clearable
                  placeholder="输入以搜索"
                  v-model="queryConditions.data.couponName"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="优惠券类型:" prop="couponMethod">
                <el-select
                  v-model="queryConditions.data.couponMethod"
                  placeholder="输入以搜索"
                  multiple
                  filterable
                  clearable
                >
                  <el-option label="满减利息券" value="A"></el-option>
                  <el-option label="利息折扣券" value="R"></el-option>
                  <el-option label="利息天数减免券" value="D"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="业务线:" prop="product">
                <el-select
                  v-model="queryConditions.data.product"
                  placeholder="输入以搜索"
                  multiple
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in productList"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>

          <template v-else>
            <el-col :span="8" :xs="24">
              <el-form-item label="模板名称:" prop="name">
                <el-input
                  clearable
                  placeholder="输入以搜索"
                  v-model="queryConditions.data.name"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :xs="24">
              <el-form-item label="业务线:" prop="product">
                <el-select
                  v-model="queryConditions.data.product"
                  placeholder="输入以搜索"
                  multiple
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in productList"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <el-col :span="24" class="btn_wrapper">
          <el-button class="btn btn-default" @click="resetForm">
            清空搜索条件
          </el-button>
          <!-- <el-button class="btn" type="primary" @click="filterData"
            >查询</el-button
          > -->
        </el-col>
      </el-form>

      <el-table
        ref="table"
        v-loading="listLoading"
        class="table"
        :data="tableData.filter(tableFilter)"
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
              v-model="scope.row.checked"
              :label="scope.row.id"
            ></el-radio>
          </template>
        </el-table-column>
        <template v-if="stragetyType === 'COUPON'">
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="couponName"
            label="优惠券名称"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.couponName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="couponMethod"
            label="优惠券类型"
          >
            <template slot-scope="scope">
              <span>{{ couponFilter(scope.row.couponMethod) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="denominations"
            label="面额"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.denominations }}</span>
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            show-overflow-tooltip
            sortable
            prop="categoryName"
            label="模板分类"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.categoryName }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            sortable
            prop="name"
            label="模板名称"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            sortable
            prop="updateBy"
            label="操作人"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.updateBy }}</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="product"
          label="业务线"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.product }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100px">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              @click.stop="previewTemplate(scope.row.id)"
            >
              预览
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        :pageSizes="[10, 20, 30, 50, 100, 1000]"
        @pagination="queryData()"
      />
    </div>
    <div class="btn_wrapper">
      <el-button type="primary" class="closeBtn" @click="closeDialog">
        关闭
      </el-button>
      <el-button type="primary" class="closeBtn" @click="submitInfo">
        提交
      </el-button>
    </div>
    <createAppPushDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createAppPushDialogShow"
      actionType="preview"
      :actionID="currentActionID"
    />
    <createSMSDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createSMSDialogShow"
      actionType="preview"
      :actionID="currentActionID"
    />
    <createIVRDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createIVRDialogShow"
      actionType="preview"
      :actionID="currentActionID"
    />
    <createCouponDialog
      @cancelDailog="templateDisplay(false)"
      :dialogShow="createCouponDialogShow"
      actionType="preview"
      :actionID="currentActionID"
    />
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import {
  querySMSTemplateList,
  queryIVRTemplateList,
  queryAppTemplateList,
  queryCouponTemplateList
} from '@/api/mkt/template.js'
import CreateAppPushDialog from '@/components/mkt/TemplateDialog/createAppPushDialog'
import CreateSMSDialog from '@/components/mkt/TemplateDialog/createSMSDialog'
import CreateIVRDialog from '@/components/mkt/TemplateDialog/createIVRDialog'
import CreateCouponDialog from '@/components/mkt/TemplateDialog/createCouponDialog'
import Pagination from '@/components/Pagination'
import { getProduct } from '@/api/mkt/stragety.js'

// if (process.env.NODE_ENV === "development") {
//   require("@/mock/laf-bg.js");
// }

export default {
  name: 'StragetySelector',
  components: {
    Pagination,
    CreateAppPushDialog,
    CreateSMSDialog,
    CreateIVRDialog,
    CreateCouponDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    },
    stragetyType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      productList: [],
      listLoading: false,
      loading: false,
      total: 0,
      tableData: [],
      queryConditions: {
        page: {
          pageNum: 1,
          pageSize: 1000
        },

        data: {
          name: '',
          product: [],
          couponName: '',
          couponMethod: []
        }
      },
      currentActionID: '',
      createAppPushDialogShow: false,
      createSMSDialogShow: false,
      createIVRDialogShow: false,
      createCouponDialogShow: false,
      currentRow: {}
    }
  },
  watch: {
    showDialog(val) {
      if (val) this.getProduct()
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  mounted() {
    this.queryData()
    // this.productList = [
    //   "PalmCredit",
    //   "EasyBuy",
    //   "NewCredit",
    //   "Xcrosscash",
    //   "Xcash",
    //   "PC-XCross",
    //   "EB-XCross"
    // ]
    // this.getProduct();
  },
  methods: {
    couponFilter(oldVal) {
      switch (oldVal) {
        case 'A':
          return '满减利息券'
          break
        case 'R':
          return '利息折扣券'
          break
        case 'D':
          return '利息天数减免券'
          break
        default:
          return ''
      }
    },
    // 获取业务线枚举
    getProduct() {
      let arr = JSON.parse(sessionStorage.getItem('omsProList'))
      if (arr && arr.length > 0) {
        this.productList = arr
      } else {
        getProduct().then((res) => {
          this.productList = res.data
          sessionStorage.setItem('omsProList', JSON.stringify(this.productList))
          // JSON.parse(sessionStorage.getItem('omsProList'))
        })
      }
    },
    previewTemplate(id) {
      this.templateDisplay(true, 'preview')
      this.currentActionID = id
      // let _this = this;
      // let data = this.queryConditions;
      // let func = {
      //   SMS: querySMSTemplateList,
      //   IVR: queryIVRTemplateList,
      //   APP: queryAppTemplateList
      // };
      // _this.listLoading = true;
      // this.templateType &&
      //   func[this.templateType](data)
      //     .then((res) => {
      //       _this.listLoading = false;
      //       if (res.data) {
      //         this.setTableData(res);
      //       }
      //     })
      //     .catch((e) => {
      //       _this.listLoading = false;
      //     });
    },
    templateDisplay: function (show, type) {
      if (type) {
        this.actionType = type
      }
      switch (this.stragetyType) {
        case 'SMS':
          this.createSMSDialogShow = show
          break
        case 'APP':
          this.createAppPushDialogShow = show
          break
        case 'IVR':
          this.createIVRDialogShow = show
          break
        case 'COUPON':
          this.createCouponDialogShow = show
          break
      }
    },
    tableFilter(element) {
      if (this.stragetyType !== 'COUPON') {
        return (
          (!this.queryConditions.data.product.length ||
            this.queryConditions.data.product.includes(element.product)) &&
          (!this.queryConditions.data.name ||
            element.name.indexOf(this.queryConditions.data.name) > -1)
        )
      } else {
        return (
          (!this.queryConditions.data.product.length ||
            this.queryConditions.data.product.includes(element.product)) &&
          (!this.queryConditions.data.couponMethod.length ||
            this.queryConditions.data.couponMethod.includes(
              element.couponMethod
            )) &&
          (!this.queryConditions.data.couponName ||
            element.couponName.indexOf(this.queryConditions.data.couponName) >
              -1)
        )
      }

      //return data => !search || data.name.toLowerCase().includes(search.toLowerCase())
    },
    closeDialog() {
      this.resetForm()
      this.$emit('update:showDialog', false)
    },
    submitInfo() {
      this.$emit('templateChanged', this.currentRow)
      this.closeDialog()
    },
    queryData: function () {
      this.getListItem(this.queryConditions)
    },
    filterData: function () {},
    handleCurrentChange(val) {
      if (val && val.id) {
        this.tableData.forEach((item) => {
          // 排他,每次选择时把其他选项都清除
          if (item.id === val.id) {
            item.checked = val.id
          } else {
            item.checked = false
          }
        })
      }
      //清空 currentRow
      Object.assign(this.currentRow, val)
    },
    resetForm: function () {
      this.$refs['StragetySelectorForm'].resetFields()
    },
    getListItem: function (e) {
      let _this = this
      let func = {
        //todo
        SMS: querySMSTemplateList,
        IVR: queryIVRTemplateList,
        APP: queryAppTemplateList,
        COUPON: queryCouponTemplateList
      }
      _this.listLoading = true
      this.stragetyType &&
        func[this.stragetyType](e)
          .then((res) => {
            _this.listLoading = false
            if (res.data) {
              this.setTableData(res)
            }
          })
          .catch((e) => {
            _this.listLoading = false
          })
    },
    setTableData: function (res) {
      res.data.forEach((item) => {
        item.checked = false
      })
      this.tableData = res.data
      this.total = res.page.totalRecord
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
