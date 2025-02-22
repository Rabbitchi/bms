<!--
	作者：ganshengqu
	时间：2020-05-27
	描述：筛选用户弹窗
-->
<template>
  <div class="filter-users">
    <el-dialog
      title="筛选用户"
      :visible.sync="filterUserDialog"
      :close-on-click-modal="false"
      :before-close="filterUserDialogClose"
    >
      <el-form
        ref="filterUserForm"
        :model="filterUserForm"
        label-width="185px"
        class="clearfix"
      >
        <el-form-item label="行为:"></el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="registrationTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="身份验证通过时间">
          <el-date-picker
            v-model="passAuthenticationTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="授信通过时间">
          <el-date-picker
            v-model="creditTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="首次交易通过时间">
          <el-date-picker
            v-model="transactionPassTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="最近1次放款成功时间">
          <el-date-picker
            v-model="lastLoanTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券最近1次使用时间">
          <el-date-picker
            v-model="couponLastTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="剩余有效优惠券数量">
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.cnpCountMin"
              @input.native="inputCnpCountMin"
            ></el-input>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.cnpCountMax"
              @input.native="inputCnpCountMax"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="贷款信息：" class="loanMsgTitle"></el-form-item>
        <el-form-item label="最近1次结清距离当前天数" class="loanMstItem-1">
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.daysSinceLastPaidOffDateMin"
              @input.native="inputSinceLastPaidOffDateMin"
            ></el-input>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.daysSinceLastPaidOffDateMax"
              @input.native="inputSinceLastPaidOffDateMax"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="当前在贷金额">
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.currentLoanAmountMin"
              @input.native="inputCurrentLoanAmountMin"
            ></el-input>
          </el-col>
          <el-col class="line" :span="1">-</el-col>
          <el-col :span="8">
            <el-input
              v-model.number="filterUserForm.currentLoanAmountMax"
              @input.native="inputCurrentLoanAmountMax"
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="最近1次交易申请是否被拒" class="loanMstItem-3">
          <el-select
            v-model="filterUserForm.isLastLoanApplyRejected"
            placeholder="请选择"
          >
            <el-option label="通过" value="false"></el-option>
            <el-option label="拒绝" value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提额：" class="loanMsgTitle"></el-form-item>
        <el-form-item label="最近1次提额时间">
          <el-date-picker
            v-model="lastWithdrawalTime"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            align="right"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer clearfix">
        <span class="userAmount">用户数量：&nbsp;{{ userCount }} 个用户</span>
        <el-button
          type="primary"
          class="buton-fl"
          @click.stop="getUserAmount"
          :disabled="modifyComfirmStatus"
        >
          查询
        </el-button>
        <el-button type="primary" class="buton-fl" @click.stop="clearData">
          清空
        </el-button>
        <el-button
          type="primary"
          @click.stop="userFiltrateComfirm"
          :disabled="comfirmStatus"
        >
          确 定
        </el-button>
        <el-button @click="filterUserDialogClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.filter-users {
  width: 100%;
  /deep/ .el-dialog {
    width: 70%;
  }
  /deep/ .el-dialog__body {
    padding-top: 0px !important;
    padding-bottom: 20px;
  }
  /deep/ .dialog-footer {
    .userAmount {
      font-size: 16px;
      color: #000000;
      font-weight: bold;
      float: left;
      line-height: 38px;
      margin-right: 15px;
    }
    .buton-fl {
      float: left;
    }
  }
  /deep/ .el-form-item {
    float: left;
    width: 50%;
    margin-bottom: 11px;
    .el-date-editor {
      width: 100%;
    }
    .el-col-1 {
      text-align: center;
    }
  }
  .remainAmount {
    .el-input {
      width: auto;
    }
  }
  /deep/ .el-form-item:first-child {
    width: 100%;
    margin-bottom: 0px;
    .el-form-item__label {
      font-weight: bold;
      text-align: left;
      color: #000000;
    }
  }
  /deep/ .loanMsgTitle {
    width: 100%;
    margin-bottom: 0px;
    .el-form-item__label {
      font-weight: bold;
      text-align: left;
      color: #000000;
    }
  }
  /deep/ .loanMstItem-1 {
    width: 50%;
    .el-form-item__label {
      width: 190px !important;
    }
    .el-form-item__content {
      margin-left: 190px !important;
    }
  }
  /deep/ .loanMstItem-2 {
    width: 30%;
    .el-form-item__label {
      width: 120px !important;
    }
    .el-form-item__content {
      margin-left: 120px !important;
    }
  }
  /deep/ .loanMstItem-3 {
    width: 35%;
    .el-form-item__label {
      width: 190px !important;
    }
    .el-form-item__content {
      margin-left: 190px !important;
    }
  }
}
</style>

<script>
import { compareTwoObjects } from '@/utils/index'
import { userFiltrate } from '@/api/bfs/letterManagement'
export default {
  components: {},
  props: {
    filterUserDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      filterUserForm: {
        registerTimeStart: '',
        registerTimeEnd: '',
        authTimeStart: '',
        authTimeEnd: '',
        creditTimeStart: '',
        creditTimeEnd: '',
        firstLoanTimeStart: '',
        firstLoanTimeEnd: '',
        lastLoanTimeStart: '',
        lastLoanTimeEnd: '',
        lastUseCnpTimeStart: '',
        lastUseCnpTimeEnd: '',
        isLastLoanApplyRejected: '',
        lastRaiseTimeStart: '',
        lastRaiseTimeEnd: '',
        cnpCountMin: null,
        cnpCountMax: null,
        daysSinceLastPaidOffDateMin: null,
        daysSinceLastPaidOffDateMax: null,
        currentLoanAmountMin: null,
        currentLoanAmountMax: null
      },
      registrationTime: [],
      passAuthenticationTime: [],
      creditTime: [],
      transactionPassTime: [],
      lastLoanTime: [],
      couponLastTime: [],
      lastWithdrawalTime: [],
      userCount: null,
      //控制“查询”按钮高亮显示
      modifyComfirmStatus: true,
      //控制“确定”按钮高亮显示
      comfirmStatus: true,
      successFilter: {},
      filterResult: ''
    }
  },
  computed: {},
  watch: {
    filterUserForm: {
      handler(newVal, oldVal) {
        let getOriginal = this.$options.data().filterUserForm
        let getNewVal = JSON.parse(JSON.stringify(newVal))
        //弹框修改数据，改变按钮状态
        this.modifyComfirmStatus = compareTwoObjects(getOriginal, getNewVal)
      },
      deep: true
    },
    registrationTime: function () {
      this.filterUserForm.registerTimeStart =
        this.registrationTime && this.registrationTime[0]
          ? this.registrationTime[0]
          : ''
      this.filterUserForm.registerTimeEnd =
        this.registrationTime && this.registrationTime[1]
          ? this.registrationTime[1]
          : ''
    },
    passAuthenticationTime: function () {
      this.filterUserForm.authTimeStart =
        this.passAuthenticationTime && this.passAuthenticationTime[0]
          ? this.passAuthenticationTime[0]
          : ''
      this.filterUserForm.authTimeEnd =
        this.passAuthenticationTime && this.passAuthenticationTime[1]
          ? this.passAuthenticationTime[1]
          : ''
    },
    creditTime: function () {
      this.filterUserForm.creditTimeStart =
        this.creditTime && this.creditTime[0] ? this.creditTime[0] : ''
      this.filterUserForm.creditTimeEnd =
        this.creditTime && this.creditTime[1] ? this.creditTime[1] : ''
    },
    transactionPassTime: function () {
      this.filterUserForm.firstLoanTimeStart =
        this.transactionPassTime && this.transactionPassTime[0]
          ? this.transactionPassTime[0]
          : ''
      this.filterUserForm.firstLoanTimeEnd =
        this.transactionPassTime && this.transactionPassTime[1]
          ? this.transactionPassTime[1]
          : ''
    },
    lastLoanTime: function () {
      this.filterUserForm.lastLoanTimeStart =
        this.lastLoanTime && this.lastLoanTime[0] ? this.lastLoanTime[0] : ''
      this.filterUserForm.lastLoanTimeEnd =
        this.lastLoanTime && this.lastLoanTime[1] ? this.lastLoanTime[1] : ''
    },
    couponLastTime: function () {
      this.filterUserForm.lastUseCnpTimeStart =
        this.couponLastTime && this.couponLastTime[0]
          ? this.couponLastTime[0]
          : ''
      this.filterUserForm.lastUseCnpTimeEnd =
        this.couponLastTime && this.couponLastTime[1]
          ? this.couponLastTime[1]
          : ''
    },
    lastWithdrawalTime: function () {
      this.filterUserForm.lastRaiseTimeStart =
        this.lastWithdrawalTime && this.lastWithdrawalTime[0]
          ? this.lastWithdrawalTime[0]
          : ''
      this.filterUserForm.lastRaiseTimeEnd =
        this.lastWithdrawalTime && this.lastWithdrawalTime[1]
          ? this.lastWithdrawalTime[1]
          : ''
    }
  },
  mounted() {},
  methods: {
    inputCnpCountMin({ target }) {
      this.filterUserForm.cnpCountMin = target.value = target.value.replace(
        /[^0-9]/g,
        ''
      )
    },
    inputCnpCountMax({ target }) {
      this.filterUserForm.cnpCountMax = target.value = target.value.replace(
        /[^0-9]/g,
        ''
      )
    },
    inputSinceLastPaidOffDateMin({ target }) {
      this.filterUserForm.daysSinceLastPaidOffDateMin = target.value =
        target.value.replace(/[^0-9]/g, '')
    },
    inputSinceLastPaidOffDateMax({ target }) {
      this.filterUserForm.daysSinceLastPaidOffDateMax = target.value =
        target.value.replace(/[^0-9]/g, '')
    },
    inputCurrentLoanAmountMin({ target }) {
      this.filterUserForm.currentLoanAmountMin = target.value =
        target.value.replace(/[^0-9]/g, '')
    },
    inputCurrentLoanAmountMax({ target }) {
      this.filterUserForm.currentLoanAmountMax = target.value =
        target.value.replace(/[^0-9]/g, '')
    },
    filterUserDialogClose() {
      this.$emit('filterUserDailogClose', false)
      this.clearData()
    },
    userFiltrateComfirm() {
      this.$emit('successFilter', {
        filterResult: this.filterResult,
        userCount: this.userCount
      })
      this.clearData()
    },
    getUserAmount() {
      let _this = this
      //2秒内防重复点击
      if (_this.modifyComfirmStatus) {
        return false
      }
      _this.modifyComfirmStatus = true
      setTimeout(() => {
        _this.modifyComfirmStatus = false
      }, 2000)
      let data = {
        data: _this.filterUserForm
      }
      userFiltrate(data)
        .then((res) => {
          _this.filterResult = res.data.url
          _this.userCount = res.data.count
          _this.$message({
            message: '查询完毕',
            type: 'success'
          })
          //确认按钮高亮显示
          _this.comfirmStatus = false
        })
        .catch((e) => {
          console.log('error')
          _this.$message.error('查询失败')
        })
    },
    clearData() {
      //原始值
      let getOriginal = this.$options.data().filterUserForm
      this.filterUserForm = getOriginal
      this.registrationTime = []
      this.passTime = []
      this.creditTime = []
      this.transactionPassTime = []
      this.lastLoanTime = []
      this.couponLastTime = []
      this.lastWithdrawalTime = []
      this.passAuthenticationTime = []
      this.userCount = null
      //恢复按钮
      this.modifyComfirmStatus = true
      this.comfirmStatus = true
    }
  }
}
</script>
