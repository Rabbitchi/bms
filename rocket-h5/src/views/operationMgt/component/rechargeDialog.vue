<template>
  <div class="create-dialog">
    <el-dialog
      title="充值余额"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <p :style="{ 'text-align': 'center' }">
        <img :src="ruleForm.img_url" alt="logo图片" class="logo" />
      </p>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="产品名称" prop="product_name">
          <el-input v-model="ruleForm.product_name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="ruleForm.company" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="total_recharge_amount">
          <el-input
            v-model="ruleForm.total_recharge_amount"
            value="number"
            type="text"
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
import { productBalanceRecharge } from '@/api/manage/operatingManage'
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
          this.ruleForm = Object.assign({}, v, { total_recharge_amount: '' })
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
          callback(new Error('充值金额应为0或正整数'))
        }
      }
    }
    return {
      showDialog: false,
      ruleForm: {
        product_name: '',
        company: '',
        total_recharge_amount: '',
        img_url: ''
      },
      rules: {
        total_recharge_amount: [
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
          pid: this.ruleForm.pid,
          recharge_amount: Number(this.ruleForm.total_recharge_amount)
        }
      }
      productBalanceRecharge(data)
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
