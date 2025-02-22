<template>
  <div class="add-send-message" ref="target">
    <el-form
      :model="form"
      :rules="formRule"
      label-position="right"
      label-width="200px"
      ref="form"
    >
      <div v-show="showPhoneRecord">
        <el-row class="queryForm">
          <el-form-item label="Call Phone Number" prop="callPhoneNumber">
            <el-input v-model="form.callPhoneNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="Phone Type" prop="phoneType">
            <el-input v-model="form.phoneType" disabled></el-input>
          </el-form-item>
          <el-form-item label="Outcome" prop="outcome">
            <el-select v-model="form.outcome" @change="selectOutcome">
              <el-option
                v-for="(item, index) in selectOption.outcome"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Feedback" prop="feedback">
            <el-select
              v-model="form.feedback"
              @change="selectFeedback"
              :disabled="disableFeedback"
            >
              <el-option
                v-for="(item, index) in selectOption.feedback"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Reason of Refused" prop="reasonOfRefused">
            <el-select v-model="form.reasonOfRefused" :disabled="disableReason">
              <el-option
                v-for="(item, index) in selectOption.reasonOfRefused"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Interest Level" prop="interestLevel">
            <el-select v-model="form.interestLevel" :disabled="disableInterest">
              <el-option
                v-for="(item, index) in selectOption.interestLevel"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Sales Decision" prop="salesDecision">
            <el-select v-model="form.salesDecision">
              <el-option
                v-for="(item, index) in selectOption.salesDecision"
                :key="index"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="Promise Take Loan Date"
            prop="promiseTakeLoanDate"
          >
            <el-date-picker
              v-model="form.promiseTakeLoanDate"
              type="date"
              placeholder="choose"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="Remark" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-row>
      </div>
      <el-form-item class="btn_wrapper">
        <el-button class="cancel" @click="cancel" size="mini">Return</el-button>
        <el-button
          class="save"
          @click="save"
          type="primary"
          :loading="saveLoading"
          v-show="showPhoneRecord"
          size="mini"
        >
          Submit
        </el-button>
        <el-button
          class="submit"
          @click="submit"
          type="primary"
          :loading="submitLoading"
          v-show="showPhoneRecord"
          size="mini"
        >
          Submit and Next
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
@import '../../styles/mixin';

.queryForm {
  @include flex;
  flex-wrap: wrap;
}
.btn_wrapper {
  margin-bottom: 15px;
  flex-grow: 1;
  @include flex(flex-end);
  margin-right: 0;
}
.el-form-item {
  margin-bottom: 10px;
}
.el-form-item /deep/ .el-form-item__content {
  line-height: 30px;
}
.el-input /deep/ .el-input__inner,
.el-select /deep/ .el-input__inner,
.el-form-item /deep/ .el-form-item__label,
.el-form-item /deep/ .el-input__icon {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
</style>

<script>
import { queryCommOption, addCommunication } from '@/api/tm/process'

export default {
  props: {
    phone: {
      type: [Number, String]
    },
    phoneType: {
      type: String,
      default: ''
    },
    taskId: {
      type: String,
      default: ''
    },
    showPhoneRecord: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 提交电话记录下拉选项
      selectOption: {
        outcome: [],
        feedback: [],
        reasonOfRefused: [],
        interestLevel: [],
        salesDecision: []
      },
      haveSelectOption: false,
      // disable option
      disableFeedback: true,
      disableReason: true,
      disableInterest: true,
      form: {
        callPhoneNumber: '',
        phoneType: '',
        outcome: '',
        feedback: '',
        reasonOfRefused: '',
        interestLevel: '',
        salesDecision: '',
        promiseTakeLoanDate: '',
        remark: ''
      },
      formRule: {
        callPhoneNumber: [{ required: true, trigger: 'blur' }],
        phoneType: [{ required: true, trigger: 'blur' }],
        outcome: [{ required: true, trigger: 'change' }],
        salesDecision: [{ required: true, trigger: 'change' }]
      },
      saveLoading: false,
      submitLoading: false
    }
  },
  watch: {
    phone(val) {
      this.$refs['form'].resetFields()
      this.form.callPhoneNumber = val
      this.form.phoneType = this.phoneType
    },
    phoneType(val) {
      this.$refs['form'].resetFields()
      this.form.callPhoneNumber = this.phone
      this.form.phoneType = val
    },
    showPhoneRecord(val) {
      if (val && !this.haveSelectOption) {
        this.getSelectOption()
        this.haveSelectOption = true
      }
      // 重置表单
      this.form.callPhoneNumber = this.phone
      this.form.phoneType = this.phoneType
      this.$refs['form'].clearValidate()

      // 滚动到底部不遮挡
      if (val) {
        this.$nextTick(() => {
          const height = this.$refs['target'].clientHeight
          this.$parent.toBottom(true, height)
        })
      } else {
        this.$parent.toBottom(false, 0)
      }
    }
  },
  methods: {
    getSelectOption() {
      queryCommOption().then((res) => {
        this.selectOption = res.data
      })
    },
    selectOutcome(val) {
      if (val === 'Connected') {
        this.disableFeedback = false
        this.disableInterest = false
      } else {
        this.disableFeedback = true
        this.disableInterest = true
        this.disableReason = true
        this.form.feedback = ''
        this.form.interestLevel = ''
        this.form.reasonOfRefused = ''
      }
    },
    selectFeedback(val) {
      if (val === 'Refuse loaned') {
        this.disableReason = false
      } else {
        this.disableReason = true
        this.form.reasonOfRefused = ''
      }
    },
    cancel() {
      if (this.phone) {
        this.$confirm('Please confirm go back to My Today Task.', 'Return', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.$router.push('/task/todayTask')
        })
      } else {
        this.$router.push('/task/todayTask')
      }
    },
    save() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          const data = {
            ...this.form,
            taskId: this.taskId
          }
          addCommunication({ data })
            .then((res) => {
              this.saveLoading = false
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              this.$refs['form'].resetFields()
              this.$emit('closeRecord')
            })
            .catch((e) => {
              this.saveLoading = false
              console.error(e)
            })
        }
      })
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.submitLoading = true
          const data = {
            ...this.form,
            taskId: this.taskId
          }
          addCommunication({ data })
            .then((res) => {
              this.submitLoading = false
              let { data = 0 } = res
              this.$message({
                type: 'success',
                message: 'Submit Success'
              })
              if (parseInt(data) === -1) {
                this.$message.error('Sorry,there is no next task')
                this.$router.push('/task/todayTask')
                return
              }
              this.$router.push({
                path: '/task/process',
                query: {
                  taskId: data
                }
              })
            })
            .catch((e) => {
              this.submitLoading = false
              console.error(e)
            })
        }
      })
    }
  }
}
</script>
