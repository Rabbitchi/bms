<!--
	作者：ganshengqu
	时间：2019-11-19
	描述：cncs中发送消息弹窗框
	路径： import SendMessage from '@/components/cncs/sendMessage.vue';
-->
<template>
  <div class="add-send-message">
    <el-dialog
      title="SMS"
      :visible.sync="sendMsgShow"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form>
        <el-form-item label="Select the template">
          <el-select
            v-model="template"
            placeholder
            @change="selectTemplate"
            value-key="triggerKey"
          >
            <el-option
              :label="item.reasonTypeDesc"
              :value="item"
              v-for="(item, index) in smsTemplatesList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Cellphone No">
          <el-input v-model="viewPhone" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="Customer Name">
          <el-input
            v-model="customerName"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="SMS Content">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            placeholder
            v-model="smsContent"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="cancle" @click.stop="close">Cancel</el-button>
        <el-button class="comfirm" @click.stop="comfirm">Confirm</el-button>
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
import { convertMessage } from '@/api/cncs/processing'
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
    cellphoneNo: {
      type: String,
      default: ''
    },
    viewPhone: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    },
    overdueDays: {
      type: Number,
      default: NaN
    },
    overdueTotalAmount: {
      type: Number,
      default: NaN
    },
    loanId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      template: {},
      smsContent: '',
      form: {}
    }
  },
  watch: {
    customerName(newValue, oldValue) {
      this.smsContent = ''
      this.template = {}
    }
  },
  methods: {
    close() {
      this.$emit('closeSendMessage')
    },
    comfirm() {
      let _this = this
      let data = {
        contactPhone: _this.cellphoneNo,
        name: _this.customerName,
        smsContent: _this.smsContent,
        reasonType: _this.template.reasonType,
        triggerType: _this.template.triggerType
      }
      this.$emit('comfirmSendMessage', data)
    },
    //获取短信模板后，请求接口
    selectTemplate(e) {
      console.log(e)
      let _this = this
      _this.template = e
      if (_this.loanId) {
        let data = {
          data: {
            customerName: _this.customerName,
            phone: _this.cellphoneNo,
            templateId: e.triggerKey,
            overdueDays: _this.overdueDays,
            overdueTotalAmount: _this.overdueTotalAmount,
            loanId: _this.loanId,
            bvn: _this.$route.query.bvn,
            channel: _this.$route.query.channel
          }
        }
        convertMessage(data)
          .then((response) => {
            _this.smsContent = response.data
          })
          .catch((err) => {
            Promise.reject(err)
          })
      } else {
        this.$message({
          message: 'The system is busy, please try again later.',
          type: 'error'
        })
      }
    }
  }
}
</script>
