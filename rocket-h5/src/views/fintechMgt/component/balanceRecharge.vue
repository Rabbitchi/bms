<template>
  <div class="create-dialog">
    <el-dialog
      title="余额充值"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="公司名称" prop="company_name">
          <el-input v-model="ruleForm.company_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="currency_unit">
          <el-input
            v-model="ruleForm.currency_unit"
            :disabled="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="amount">
          <el-input
            v-model="ruleForm.amount"
            value="number"
            type="text"
            maxlength="8"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">
            确定
          </el-button>
          <el-button @click="dialogClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { recharge } from '@/api/manage/companyManage'
export default {
  components: {},
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    chargeInfo: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    chargeInfo: {
      handler(v) {
        if (v) {
          this.ruleForm = Object.assign({}, v)
        }
      },
      deep: true
    }
  },
  data() {
    const validateCharge = (rule, value, callback) => {
      if (value) {
        const reg = /^\+?(0|[1-9][0-9]*)$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请填写整数'))
        }
      }
    }
    return {
      showDialog: false,
      ruleForm: {
        app_id: '',
        company_name: '',
        currency_unit: '',
        amount: ''
      },
      rules: {
        company_name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        currency_unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          { validator: validateCharge, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 充值接口
    queryRecharge() {
      let data = {
        data: {
          app_id: this.ruleForm.app_id,
          amount: this.ruleForm.amount.toString()
        }
      }
      recharge(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$emit('cancelDailog', false)
            this.$emit('updateList')
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
        .finally((e) => {
          this.$emit('cancelDailog', false)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitResult()
        } else {
          console.log('error submit!!')
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
        this.queryRecharge()
      })
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.create-dialog {
  width: 100%;

  /deep/ .el-dialog__header {
    text-align: center;
    padding-bottom: 10px;
    border-bottom: dashed 1px gray;
  }

  /deep/ .el-dialog {
    border-radius: 5px;
  }

  /deep/ .el-dialog__body {
    padding-top: 10px;
  }

  .logo {
    width: 90px;
    height: 90px;
  }
}
</style>
