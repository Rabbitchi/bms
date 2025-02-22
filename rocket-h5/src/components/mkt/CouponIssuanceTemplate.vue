<!--
	作者：ganshengqu
	时间：2021-01-18
	描述：发放优惠券弹窗
-->
<template>
  <div class="create-dialog">
    <el-dialog
      title="优惠券发放"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <el-form
        ref="formDom"
        :inline="true"
        :model="form"
        label-width="160px"
        class="clearfix"
        :rules="rules"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="优惠券名称：" :required="true">
              <el-input
                v-model="extraFieldForm.couponName"
                maxlength="20"
                autocomplete="off"
                placeholder
              ></el-input>
              <el-button
                type="primary"
                icon="el-icon-search"
                style="
                  position: absolute;
                  right: 0;
                  top: 1px;
                  border-top-left-radius: 0;
                  border-bottom-left-radius: 0;
                "
                @click.stop="openDialog"
              ></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务线：">
              <el-input
                v-model="form.channel"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" class="couponMethodDom">
            <el-form-item label="券类型：">
              <el-select
                v-model="extraFieldForm.couponMethod"
                placeholder
                :disabled="true"
              >
                <el-option label="满减利息券" value="A"></el-option>
                <el-option label="利息折扣券" value="R"></el-option>
                <el-option label="利息天数减免券" value="D"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="面额："
              class="amtDom"
              v-if="extraFieldForm.couponMethod == 'R'"
            >
              <el-input
                v-model="extraFieldForm.amt"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
              <span class="text">%</span>
            </el-form-item>
            <el-form-item
              label="面额："
              class="amtDom"
              v-else-if="extraFieldForm.couponMethod == 'D'"
            >
              <el-input
                v-model="extraFieldForm.amt"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
              <span class="text">D</span>
            </el-form-item>
            <el-form-item label="面额：" class="amtDom" v-else>
              <el-input
                v-model="extraFieldForm.amt"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
              <span class="text">N</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="适用产品(时长)：">
              <el-input
                v-model="extraFieldForm.reducedDays"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低金额：">
              <el-input
                v-model="extraFieldForm.reducedAmount"
                :disabled="true"
                autocomplete="off"
                placeholder
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="ValidityPeriod">
          <el-col :span="24">
            <el-form-item label="优惠券有效期：">
              <el-date-picker
                :disabled="true"
                v-model="timeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="Start Time"
                end-placeholder="End Time"
                value-format="yyyy-MM-dd"
                align="right"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="ValidityPeriod">
          <el-col :span="24">
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                v-model="form.remark"
                maxlength="20"
                :rows="1"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="uploadDom">
          <el-col :span="24">
            <el-form-item label="选择名单" prop="batchNo">
              <el-button
                size="small"
                class="userSelect"
                @click.stop="selectList"
              >
                选择
              </el-button>
              <span class="userSelectTXT">{{ form.batchNo }}</span>
            </el-form-item>
            <!-- <el-form-item label="发放对象：" :required="true">
              <ImportList
                @getBinaryData="getBinaryData"
                buttonText="上传附件"
                importType="excel"
                :isOms="false"
                ref="importCouponDom"
                purpose="coupon"
                requiredColumns="bvn"
              />
            </el-form-item> -->
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="confirmBack">返回</el-button>
        <el-button
          type="primary"
          v-loading.fullscreen.lock="fullscreenLoading"
          :disabled="form.batchNo == ''"
          @click="confirmAdd('formDom')"
        >
          提交
        </el-button>
      </div>
    </el-dialog>
    <!--查看优惠券-->
    <el-dialog
      title="查看券名称"
      :visible.sync="dialogCheck"
      :before-close="dialogCheckClose"
    >
      <el-form :inline="true" :model="checkForm" class="demo-form-inline">
        <el-form-item label="优惠券券名称">
          <el-input
            v-model="checkForm.couponName"
            placeholder="优惠券券名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="券类型">
          <el-select v-model="checkForm.couponMethod" placeholder>
            <el-option label="All" value=""></el-option>
            <el-option label="满减利息券" value="A"></el-option>
            <el-option label="利息折扣券" value="R"></el-option>
            <el-option label="利息天数减免券" value="D"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务线">
          <el-select v-model="checkForm.channel" placeholder>
            <el-option label="All" value=""></el-option>
            <el-option
              v-for="(item, index) in productList"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <!--表格-->
      <el-table
        ref="table"
        class="table checkDailog"
        v-loading="listLoading"
        @row-click="handleCurrentChange"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="优惠券名称" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.couponName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务线" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.channel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="券类型" align="center">
          <template slot-scope="scope" v-if="scope.row.couponMethod">
            <span v-if="scope.row.couponMethod === 'A'">满减利息券</span>
            <span v-else-if="scope.row.couponMethod === 'R'">利息折扣券</span>
            <span v-else>利息天数减免券</span>
          </template>
        </el-table-column>
        <el-table-column label="面额" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amt }}</span>
          </template>
        </el-table-column>
        <el-table-column label=" 适用产品（时长）" align="center">
          <template slot-scope="scope">
            <span>
              {{ scope.row.reducedDays | dealConvertName(reducedDays) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="最低提现金额" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.reducedAmount">0</span>
            <span v-else>{{ scope.row.reducedAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近修改时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <DataListSelector
      :showDialogBatchNo.sync="showDialogBatchNo"
      @selectBatch="selectBatch"
    />
  </div>
</template>

<style lang="scss" scoped>
.checkDailog {
  /deep/ .el-table__row {
    cursor: pointer;
  }
  /deep/ .el-table__row:hover {
    color: #409eff;
  }
}
.couponMethodDom {
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 15px !important;
  }
}
.userSelect {
  font-size: 14px;
  color: #606266;
}
.userSelectTXT {
  margin-left: 10px;
}
</style>

<script>
import ImportList from '@/components/bfs/importList'
import { mapGetters } from 'vuex'
import { createCoupon, findCouponConfigList } from '@/api/mkt/coupon.js'
import { getProduct } from '@/api/mkt/stragety.js'
import DataListSelector from '@/components/bfs/dataListSelector'
export default {
  components: { ImportList, DataListSelector },
  filters: {
    dealConvertName(val, reducedDaysArray) {
      if (val) {
        //数字转字符串
        let getVal = val.toString()
        let result = reducedDaysArray.filter(function (value, index, array) {
          return value.value == getVal
        })
        return result[0].name
      } else {
        //适用产品（时长）为all时，需要显示为0
        return '0'
      }
    }
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    senderEmailList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
      productList: [],
      fullscreenLoading: false,
      listLoading: false,
      showDialogBatchNo: false, // 选择名单弹窗
      form: {
        configId: '',
        channel: '',
        // "fileUrl": "",
        batchNo: '',
        createUser: '',
        remark: ''
      },
      //不用提交的字段
      extraFieldForm: {
        couponName: '',
        couponMethod: '',
        reducedAmount: '',
        amt: '',
        reducedDays: '',
        effectiveDate: '',
        expiryDate: ''
      },
      //表单校验规则
      rules: {
        couponId: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ]
      },
      timeRange: [],
      dialogCheck: false,
      checkForm: {
        couponName: '',
        couponMethod: '',
        channel: '',
        startCreateTime: '',
        endCreateTime: '',
        status: 'ENABLED',
        effectiveDate: '',
        expiryDate: ''
      },
      tableData: [],
      //适用产品（时长）:
      reducedDays: [
        { name: '7D', value: '7' },
        { name: '14D', value: '14' },
        { name: '21D', value: '21' },
        { name: '28D', value: '28' },
        { name: '2T', value: '60' },
        { name: '3T', value: '90' },
        { name: '4T', value: '120' },
        { name: '5T', value: '150' },
        { name: '6T', value: '180' },
        { name: '7T', value: '210' },
        { name: '8T', value: '240' },
        { name: '9T', value: '270' },
        { name: '10T', value: '300' },
        { name: '11T', value: '330' },
        { name: '12T', value: '360' }
      ]
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    dialogShow(val) {
      if (val) this.getProduct()
    }
  },
  created() {
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
    //关闭“查看券名称”弹窗，清空数据
    clearDialogData() {
      let obj = this.checkForm
      Object.keys(obj).forEach((key) => (obj[key] = ''))
      this.checkForm.status = 'ENABLED'
      this.tableData = []
    },
    //清空“优惠券发放”弹窗数据
    clearCouponIssuanceData() {
      let _this = this
      let obj = _this.form
      let extraObj = _this.extraFieldForm
      Object.keys(obj).forEach((key) => (obj[key] = ''))
      Object.keys(extraObj).forEach((key) => (extraObj[key] = ''))
      this.$refs['formDom'].resetFields()
      // this.$refs.importCouponDom.removeUploadFile();
    },
    handleCurrentChange(val) {
      this.form.configId = val.configId
      this.form.channel = val.channel
      this.extraFieldForm.couponName = val.couponName
      this.extraFieldForm.couponMethod = val.couponMethod
      if (!val.reducedAmount) {
        this.extraFieldForm.reducedAmount = '0'
      } else {
        this.extraFieldForm.reducedAmount = val.reducedAmount
      }
      this.extraFieldForm.amt = val.amt
      if (!val.reducedDays) {
        this.extraFieldForm.reducedDays = '0'
      } else {
        this.extraFieldForm.reducedDays = val.reducedDays
      }
      this.timeRange = [val.effectiveDate, val.expiryDate]
      this.clearDialogData()
      this.dialogCheck = false
    },
    onSubmit() {
      let _this = this
      _this.listLoading = true
      let reqData = {
        page: {
          pageNum: 1,
          pageSize: 50
        },
        data: _this.checkForm
      }
      // 分页逻辑
      findCouponConfigList(reqData)
        .then((res) => {
          _this.listLoading = false
          if (res.data) {
            _this.tableData = res.data
          }
        })
        .catch((e) => {
          _this.listLoading = false
        })
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      this.clearCouponIssuanceData()
    },
    // getBinaryData(data){
    //   this.form.fileUrl = data.fileUrl;
    // },
    // 选择名单
    selectList() {
      this.showDialogBatchNo = true
    },
    selectBatch(row) {
      if (row) {
        this.form.batchNo = row.batchNo
        console.log(this.form)
        this.$message({
          message: '选择成功',
          type: 'success'
        })
      }
    },
    confirmBack() {
      this.$emit('cancelDailog', false)
      this.clearCouponIssuanceData()
    },
    confirmAdd(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.fullscreenLoading = true
          _this.form.createUser = _this.name
          let reqData = {
            page: {
              pageNum: 1,
              pageSize: 50
            },
            data: _this.form
          }
          createCoupon(reqData)
            .then((res) => {
              _this.fullscreenLoading = false
              _this.$emit('cancelDailog', false)
              _this.clearCouponIssuanceData()
              _this.$message({
                type: 'success',
                message: '优惠券发放成功!'
              })
            })
            .catch((e) => {
              _this.fullscreenLoading = false
              _this.$message.error('优惠券发放失败!')
              console.log('error')
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    dialogCheckClose() {
      this.clearDialogData()
      this.dialogCheck = false
    },
    openDialog() {
      this.dialogCheck = true
    }
  }
}
</script>

<style scoped lang="scss">
.ValidityPeriod {
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-form-item__content {
    width: calc(100% - 260px);
  }
  /deep/ .el-date-editor--daterange {
    width: 100%;
  }
}
.uploadDom {
  /deep/ .el-upload-list--text {
    position: relative;
    margin-top: -30px;
  }
}
.amtDom {
  position: relative;
  .text {
    color: #000000;
    position: absolute;
    right: -15px;
    top: 0;
  }
}
</style>
