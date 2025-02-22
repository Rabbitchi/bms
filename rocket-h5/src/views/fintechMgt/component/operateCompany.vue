<template>
  <div>
    <header-title
      :title="operateType === 'create' ? '新增公司' : '编辑公司'"
    ></header-title>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <p class="set-title">公司设置</p>
      <el-form-item label="公司名称" prop="company_name">
        <el-input
          v-model="ruleForm.company_name"
          placeholder="请填写公司名称"
          :disabled="operateType === 'modify'"
        ></el-input>
      </el-form-item>
      <el-form-item label="结算货币" prop="currency_unit">
        <el-select
          v-model="ruleForm.currency_unit"
          placeholder="请选择"
          :disabled="operateType === 'modify'"
        >
          <el-option
            v-for="(item, index) in currencyList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="信用额度" prop="hold_remain_amount">
        <el-input
          v-model="ruleForm.hold_remain_amount"
          placeholder="请填写信用额度"
          @input="holdRemainAmountInput"
          maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="余额预警值" prop="alert_remain_amount">
        <el-input
          v-model="ruleForm.alert_remain_amount"
          placeholder="请填写余额预警值(选填)"
          @input="alertRemainAmountInput"
          maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="提醒接收邮箱" prop="contact_email">
        <el-input
          v-model="ruleForm.contact_email"
          placeholder="请填写接收提醒邮箱"
        ></el-input>
      </el-form-item>
      <p class="set-title">单价设置</p>
      <div class="choose-content">
        <el-col :span="12">
          <el-form-item label="黑名单" prop="blacklist_srv_price">
            <el-input
              type="number"
              value="number"
              v-model.trim="ruleForm.blacklist_srv_price"
              placeholder="请填写单价"
              @input="priceInputBlack"
              @blur="priceBlackBlur"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="label-unit">{{ labelUnit }}</span>
        </el-col>
      </div>
      <div class="choose-content">
        <el-col :span="12">
          <el-form-item label="风控评分" prop="score_srv_price">
            <el-input
              v-model="ruleForm.score_srv_price"
              placeholder="请填写单价"
              @input="priceInputScore"
              @blur="priceScoreBlur"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="label-unit">{{ labelUnit }}</span>
        </el-col>
      </div>
      <div class="choose-content">
        <el-col :span="12">
          <el-form-item label="BVN验真" prop="bvn_verify_srv_price">
            <el-input
              v-model="ruleForm.bvn_verify_srv_price"
              placeholder="请填写单价"
              @input="priceInputBvn"
              @blur="priceBvnBlur"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="label-unit">{{ labelUnit }}</span>
        </el-col>
      </div>
      <div class="choose-content">
        <el-col :span="12">
          <el-form-item label="共债查询" prop="loan_summary_srv_price">
            <el-input
              v-model="ruleForm.loan_summary_srv_price"
              placeholder="请填写单价"
              @input="priceInputLoan"
              @blur="priceLoanBlur"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <span class="label-unit">{{ labelUnit }}</span>
        </el-col>
      </div>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          确定
        </el-button>
        <el-button @click="backLastPage()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import HeaderTitle from '@/components/manage/headerTitle.vue'
import { saveComponyInfo, getCompanyOne } from '@/api/manage/companyManage'

export default {
  name: 'OpeateCompany',
  components: { HeaderTitle },
  data() {
    // 验证一个/多个邮箱
    const checkEmail = (rule, value, callback) => {
      let reg =
        /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})(,([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4}))*$/
      if (value === '' || value === undefined || value == null) {
        callback()
      } else {
        if (reg.test(value.trim())) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
    }

    return {
      currencyList: [
        { label: '人民币', value: 'RMB' },
        { label: '美元', value: 'USD' }
      ],
      labelUnit: '笔/美元',
      operateType: 'modify',
      ruleForm: {
        company_name: '',
        currency_unit: '',
        hold_remain_amount: '',
        alert_remain_amount: '',
        contact_email: '',
        blacklist_srv_price: '',
        score_srv_price: '',
        bvn_verify_srv_price: '',
        loan_summary_srv_price: ''
      },
      rules: {
        company_name: [
          {
            required: true,
            message: '请输入公司名称',
            trigger: 'blur'
          }
        ],
        currency_unit: [
          { required: true, message: '请选择结算货币', trigger: 'change' }
        ],
        contact_email: [{ validator: checkEmail, trigger: 'change' }]
      }
    }
  },
  watch: {
    'ruleForm.currency_unit': {
      handler(v) {
        let tmpval = ''
        if (v === '' || v === 'USD') {
          tmpval = '笔/美元'
        } else {
          tmpval = '笔/元'
        }
        this.labelUnit = tmpval
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (Object.keys(this.$route.query).length) {
      // 判断是创建模板还是修改模板
      if (this.$route.query.type) {
        this.operateType = this.$route.query.type
      } else {
        this.operateType = 'modify'
      }
      if (this.$route.query.appid) {
        let appid = this.$route.query.appid
        this.initEditData(appid)
      }
    }
  },
  methods: {
    amountInput(key, val) {
      this.ruleForm[key] = val
        .replace(/[^\d.]/g, '') // 先把非数字的都替换掉，除了数字和 .
        .replace(/\.{2,}/g, '.') // 保证只有出现一个 . 而没有多个 .
        .replace(/^\./g, '') // 必须保证第一个为数字而不是 .
        .replace('.', '$#$') // 保证 . 只出现一次，而不能出现两次以上
        .replace(/\./g, '')
        .replace('$#$', '.')
        // 只能输入两位小数
        .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        // 只能输入 8 位整数
        .replace(/^\D*(\d{0,8}(?:\.\d{0,2})?).*$/g, '$1')
    },
    alertRemainAmountInput(val) {
      this.ruleForm.alert_remain_amount = val.replace(/[^\d]/g, '')
      if (Number(this.ruleForm.alert_remain_amount) === 0) {
        this.ruleForm.alert_remain_amount = ''
      }
    },
    holdRemainAmountInput(val) {
      this.ruleForm.hold_remain_amount = val.replace(/[^\d]/g, '')
      if (Number(this.ruleForm.hold_remain_amount) === 0) {
        this.ruleForm.hold_remain_amount = ''
      }
    },
    priceInputBlack(val) {
      // this.priceInput('blacklist_srv_price', val)
      this.amountInput('blacklist_srv_price', val)
    },
    priceInputScore(val) {
      // this.priceInput('score_srv_price', val)
      this.amountInput('score_srv_price', val)
    },
    priceInputBvn(val) {
      // this.priceInput('bvn_verify_srv_price', val)
      this.amountInput('bvn_verify_srv_price', val)
    },
    priceInputLoan(val) {
      // this.priceInput('loan_summary_srv_price', val)
      this.amountInput('loan_summary_srv_price', val)
    },
    priceInput(key, val) {
      this.ruleForm[key] =
        ('' + val) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, '') // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, '$1') // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, '0.') // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    priceBlackBlur(e) {
      const val = e.target.value
      this.ruleForm.blacklist_srv_price = parseFloat(val).toString()
    },
    priceScoreBlur(e) {
      const val = e.target.value
      this.ruleForm.score_srv_price = parseFloat(val).toString()
    },
    priceBvnBlur(e) {
      const val = e.target.value
      this.ruleForm.bvn_verify_srv_price = parseFloat(val).toString()
    },
    priceLoanBlur(e) {
      const val = e.target.value
      this.ruleForm.loan_summary_srv_price = parseFloat(val).toString()
    },
    initEditData(appid) {
      let _this = this
      getCompanyOne({ data: { app_id: appid } })
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            data.hold_remain_amount = parseInt(data.hold_remain_amount)
            data.alert_remain_amount = parseInt(data.alert_remain_amount)
            Object.assign(_this.ruleForm, data)
          }
        })
        .catch((e) => {
          console.log('error')
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitResult()
        } else {
          return false
        }
      })
    },
    submitResult() {
      this.$confirm('确认是否提交?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = JSON.parse(JSON.stringify(this.ruleForm))
        let data = {
          data: Object.assign({}, obj)
        }
        this.operateType === 'create'
          ? this.addCompany(data)
          : this.editCompany(data)
      })
    },
    addCompany(data) {
      saveComponyInfo(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.go(-1)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    editCompany(data) {
      saveComponyInfo(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.go(-1)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    backLastPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.choose-content {
  display: flex;
}
.isprofile {
  /deep/ .el-form-item__label {
    width: 220px !important;
  }
}
.set-title {
  font-size: 18px;
  font-weight: bold;
  padding-left: 20px;
  margin-bottom: 20px;
}
.label-unit {
  display: inline-block;
  margin-top: 12px;
  margin-left: 20px;
  color: #606266;
}
</style>
<style lang="scss">
.hiddenErrorTip {
  .el-form-item__content .el-form-item__error {
    display: none;
  }
}
</style>
