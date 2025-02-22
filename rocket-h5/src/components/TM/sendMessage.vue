<template>
  <div class="add-send-message">
    <el-dialog
      title="SMS"
      :visible.sync="sendMsgShow"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form ref="msgForm" :model="form">
        <el-form-item label="Select the template" prop="reasonType">
          <el-select
            v-model="form.reasonType"
            placeholder
            @change="selectTemplate"
            value-key="triggerKey"
          >
            <el-option
              :label="item.reasonType"
              :value="item"
              v-for="(item, index) in smsTemplatesList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cellphone No">
          <el-input v-model="cellphone" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="Customer Name">
          <el-input
            v-model="customerName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="SMS Content" prop="smsContent">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder
            v-model="form.smsContent"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancle" @click.stop="close">Cancel</el-button>
        <el-buttonclass="comfirm" @click.stop="comfirm" :loading="loading">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.add-send-message {
  width: 100%;
  .el-dialog {
    width: 754px;
    min-height: 408px;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    .el-dialog__close {
      display: none;
    }
    .el-dialog__header {
      padding: 33px 31px 24px 32px;
      .el-dialog__title {
        font-family: Avenir-Heavy;
        font-size: 20px;
        color: #000000;
        font-weight: 600;
        line-height: 27px;
      }
    }
    .el-dialog__body {
      padding: 0 31px 0 32px;
    }
    .el-form {
      *zoom: 1;
      .el-form-item {
        float: left;
        margin-bottom: 20px;
        text-align: left;
        .el-form-item__label {
          font-family: Avenir-Medium;
          font-size: 14px;
          color: #606266;
          padding: 0;
          letter-spacing: 0;
          width: 143px !important;
          text-align: left;
          font-weight: normal;
        }
        .el-form-item__content {
          width: 200px;
          margin-left: 143px !important;
        }
      }
      .el-form-item:nth-child(2) {
        float: right;
        .el-form-item__label {
          text-align: right;
          padding-right: 20px;
        }
      }
      .el-form-item:nth-child(4) {
        width: 100%;
        margin-bottom: 0;
        .el-form-item__content {
          width: calc(100% - 143px);
        }
      }
      .el-textarea__inner {
        min-height: 76px !important;
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
    .el-dialog__footer {
      padding: 48px 31px 0 32px;
      .cancle {
        width: 77px;
        height: 36px;
        border: 1px solid #409eff;
        border-radius: 4px;
        font-family: Avenir-Medium;
        font-size: 12px;
        color: #409eff;
        box-sizing: border-box;
        line-height: 0;
      }
      .el-button + .el-button {
        margin-left: 20px;
      }
      .comfirm {
        width: 84px;
        height: 36px;
        background: #409eff;
        border-radius: 4px;
        border: 0;
        font-family: Avenir-Medium;
        font-size: 12px;
        color: #ffffff;
        line-height: 0;
      }
    }
  }
}
</style>

<script>
import { queryTempInformByTempCode } from '@/api/tm/process'

export default {
  props: {
    sendMsgShow: {
      type: Boolean,
      default: false
    },
    smsTemplatesList: {
      type: Array,
      default() {
        return []
      }
    },
    cellphone: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        reasonType: '',
        smsContent: ''
      },
      templateCode: '',
      loading: false
    }
  },
  methods: {
    close() {
      let callback = () => {
        this.$refs['msgForm'].resetFields()
        this.loading = false
      }
      this.$emit('closeSendMessage', callback)
    },
    comfirm() {
      let data = {
        phoneNumber: this.cellphone,
        smsContent: this.form.smsContent,
        templateCode: this.templateCode
      }
      this.loading = true
      let callback = () => {
        this.loading = false
        this.$refs['msgForm'].resetFields()
      }
      this.$emit('comfirmSendMessage', data, callback)
    },
    selectTemplate(e) {
      queryTempInformByTempCode({
        data: e.triggerKey
      })
        .then((res) => {
          this.form.smsContent = res.data.content
          this.templateCode = res.data.templateCode
        })
        .catch((e) => {})
    }
  }
}
</script>
