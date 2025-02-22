<template>
  <div class="add-offline-payment">
    <el-dialog
      :visible.sync="showOffline"
      title="Offline Payment"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form ref="offlinePayment" :model="formData" :rules="rules">
        <el-form-item label="Paid off date" prop="paidDate">
          <el-date-picker
            v-model="formData.paidDate"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="Paid amount" prop="paidAmount">
          <el-input v-model="formData.paidAmount" @input.native="inputAmount" />
        </el-form-item>
        <el-form-item label="Paid Proof" prop="proof">
          <UploadFile
            :show-file-list="false"
            :max-size="51200"
            :max="10"
            accept=".pdf,image/*"
            :disabled="isUploading"
            :value="images"
            :button-text="isUploading ? 'Uploading' : 'Upload'"
            @beforeUpload="handleBeforeUpload"
            @error="handleUploadError"
            @success="handleUploadSuccess"
          />
        </el-form-item>
        <div class="filelist">
          <div
            class="image_wrapper"
            v-for="(item, index) in images"
            :key="item.objectKey"
          >
            <el-image class="image" :src="item.url" fit="contain">
              <div class="otherType" slot="error">
                <i class="el-icon-folder-checked"></i>
              </div>
            </el-image>
            <div
              class="btn_delete el-icon-close"
              @click="removeImage(index)"
            ></div>
          </div>
        </div>
        <el-form-item label="Transfer Type" prop="transferType">
          <el-select v-model="formData.transferType">
            <el-option
              v-for="item in transferTypeOptions"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Transfer Account" prop="transferAccount">
          <el-select v-model="formData.transferAccount">
            <el-option
              v-for="item in transferAccountOptions"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            autosize
            maxlength="500"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="comfirm" @click.stop="submit" :disabled="isUploading">
          Submit
        </el-button>
        <el-button class="cancle" @click.stop="cancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UploadFile from '@/components/Upload/UploadFile'

export default {
  components: {
    UploadFile
  },
  props: {
    showOffline: {
      default: false,
      type: Boolean
    }
  },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value) {
        const reg = /^\d+([.]{1}[\d]{1,2}){0,1}$/
        if (reg.test(value)) {
          callback()
        } else if (/^\d+([.]{1}[\d]+){0,1}$/.test(value)) {
          callback(
            new Error('no more than two character after the decimal point')
          )
        } else {
          callback(new Error('need input number'))
        }
      } else {
        callback(new Error('require'))
      }
    }

    return {
      formData: {
        paidDate: '',
        paidAmount: '',
        proof: [],
        transferType: '',
        transferAccount: '',
        remark: ''
      },
      images: [],
      rules: {
        paidDate: [{ required: true, trigger: 'blur' }],
        paidAmount: [
          { required: true, validator: validateAmount, trigger: 'blur' }
        ],
        proof: [{ required: true, trigger: 'change' }],
        transferType: [{ required: true, trigger: 'change' }],
        transferAccount: [{ required: true, trigger: 'change' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      transferTypeOptions: [
        { value: 'Cash deposit' },
        { value: 'online banking transfer' },
        { value: 'mobile banking transfer' },
        { value: 'third party transfer' },
        { value: 'USSD' },
        { value: 'ATM' },
        { value: 'Bank counter' },
        { value: 'Other' }
      ],
      transferAccountOptions: [
        { value: '0772693491 (TRANSSNET FINANCIAL NIGERIA LIMITED)' },
        { value: '0809183272 (TRANSSNET FINANCIAL NIGERIA LIMITED)' },
        { value: '1237256068 (NEW EDGE FINANCE LIMITED - X-CROSS TRANSFER)' },
        { value: '1420402913 (NEW EDGE FINANCE LIMITED-NEWCREDIT TRANSFER)' }
      ],
      isUploading: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showOffline', false)
    },
    submit() {
      this.$refs['offlinePayment'].validate((valid) => {
        if (valid) {
          let data = this.formData
          let callback = () => {
            this.$refs['offlinePayment'].resetFields()
            this.images = []
          }
          this.$emit('submit', data, callback)
          this.$emit('update:showOffline', false)
        }
      })
    },
    handleBeforeUpload() {
      this.isUploading = true
    },
    handleUploadError() {
      this.$message.error('upload fail!please checkout your network.')
      this.isUploading = false
    },
    inputAmount(event) {
      let e = event.target.value.replace(/[^\d.]/g, '')
      this.formData.paidAmount = e
    },
    handleUploadSuccess(fileObj) {
      this.isUploading = false
      this.$message.success('upload success!')
      this.images.push(fileObj)
      this.formData.proof.push({
        objectKey: fileObj.objectKey,
        proofName: fileObj.name
      })
      this.$refs['offlinePayment'].validateField('proof')
    },
    removeImage(index) {
      this.images.splice(index, 1)
      this.formData.proof.splice(index, 1)
      this.$refs['offlinePayment'].validateField('proof')
    },
    cancel() {
      this.$emit('update:showOffline', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-offline-payment {
  width: 100%;
}
.add-offline-payment /deep/ .el-dialog {
  width: 754px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  .el-dialog__header {
    padding: 33px 31px 0 32px;
    .el-dialog__headerbtn {
      display: none;
    }
    .el-dialog__title {
      font-family: Avenir-Black;
      font-size: 20px;
      color: #000000;
      font-weight: 600;
    }
  }
  .el-dialog__body {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 31px 48px 32px;
    .el-form {
      width: 100%;
      *zoom: 1;
      .el-form-item {
        margin-bottom: 20px;
        .el-form-item__label {
          width: 143px;
          box-sizing: border-box;
          text-align: right;
          float: left;
          font-family: Avenir-Book;
          padding-right: 0 20 0 0px;
          font-size: 14px;
          color: #606266;
          letter-spacing: 0;
        }
        .el-form-item__content {
          width: calc(100% - 143px);
          float: left;
        }
        .el-input {
          width: 220px;
        }
        .el-select {
          .el-input {
            width: 300px;
          }
        }
      }
      .el-form-item:last-child {
        margin-bottom: 0;
      }
      .filelist {
        box-sizing: border-box;
        width: 100%;
        padding: 0 60px;
        display: flex;
        flex-wrap: wrap;
        .image_wrapper {
          width: calc((100% - 80px) / 5);
          position: relative;
          margin-right: 20px;
          margin-bottom: 20px;
          .image {
            width: 100%;
            height: 100%;
          }
          .otherType {
            background-color: #f5f7fa;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
          }
          &:nth-child(5n) {
            margin-right: 0;
          }

          .btn_delete {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            color: red;
          }
        }
      }
    }
    .el-form:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: ' ';
      clear: both;
      height: 0;
    }
  }
  .el-dialog__footer {
    padding: 0;
    height: 73px;
    padding-right: 31px;
    .el-button {
      margin: 0;
      float: right;
      border: 1px solid #409eff;
      border-radius: 4px;
      font-family: Avenir-Medium;
      font-size: 12px;
      color: #409eff;
    }
    .el-button:first-child {
      margin-left: 30px;
      background: #409eff;
      color: #ffffff;
      &.is-disabled {
        color: #fff;
        background-color: #a0cfff;
        border-color: #a0cfff;
      }
    }
  }
}
</style>
