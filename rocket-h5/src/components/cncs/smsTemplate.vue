<template>
  <div class="sms-template">
    <el-dialog
      :visible.sync="showDialog"
      :title="isEdit ? 'Edit SMS Template' : 'Add SMS Template'"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <el-form ref="smsTemplate" :model="formData" :rules="rules">
        <el-form-item label="Channel" prop="channel">
          <el-input v-model="formData.channel" disabled />
        </el-form-item>
        <el-form-item label="Name" prop="templateName">
          <el-input v-model="formData.templateName" maxlength="20" />
        </el-form-item>
        <div class="var__list" v-if="vars.length > 0">
          <template v-if="formData.channel === 'Kashcash'">
            <!-- 对接H5还款 占位符${REPAYMENT_H5} 在Kashcash的时候 不需要展示 -->
            <span
              @click="copyText(item)"
              v-for="(item, index) in hiddenVars"
              :key="index"
              class="var"
            >
              {{ item }}
            </span>
          </template>
          <template v-else>
            <span
              @click="copyText(item)"
              v-for="(item, index) in vars"
              :key="index"
              class="var"
            >
              {{ item }}
            </span>
          </template>
        </div>
        <el-form-item label="Content" prop="templateContent">
          <el-input
            v-model="formData.templateContent"
            type="textarea"
            :autosize="textAreaSize"
            maxlength="800"
            show-word-limit
          ></el-input>
          <p class="item_sms_content">
            <span class="sms_result">characters：{{ smsContent.tpUdl }}</span>
            <span
              class="sms_result"
              :class="{ red: smsContent.tpud && smsContent.tpud.length > 3 }"
            >
              split_count：{{ smsContent.tpud ? smsContent.tpud.length : 0 }}
            </span>
            <span
              class="sms_result red"
              v-if="smsContent.notGsm7 && smsContent.notGsm7.length > 0"
            >
              No-GSM Characters：{{ smsContent.notGsm7.length }}
              (
              <span v-for="(item, index) in smsContent.notGsm7" :key="index">
                {{ item }}
                <template v-if="index !== smsContent.notGsm7.length - 1">
                  ,
                </template>
              </span>
              )
            </span>
            <span v-else class="sms_result">No-GSM Characters：0</span>
            <span
              class="sms_result red"
              v-if="
                smsContent.sensitiveWords &&
                smsContent.sensitiveWords.length > 0
              "
            >
              Sensitive characters：{{ smsContent.sensitiveWords.length }}
              (
              <span
                v-for="(item, index) in smsContent.sensitiveWords"
                :key="index"
              >
                {{ item }}
                <template v-if="index !== smsContent.sensitiveWords.length - 1">
                  ,
                </template>
              </span>
              )
            </span>
            <span v-else class="sms_result">Sensitive characters：0</span>
          </p>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="comfirm" @click.stop="submit">Submit</el-button>
        <el-button class="cancle" @click.stop="cancel">Cancel</el-button>
        <!-- 模板规范 -->
        <el-button type="text" class="no_border" @click="toTemRulesEN">
          template specification
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'
// import { validationShortMsg } from '@/api/hart/hart.js'
export default {
  props: {
    showDialog: {
      default: false,
      type: Boolean
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    channel: {
      default: '',
      type: String
    },
    vars: {
      default: () => [],
      type: Array
    },
    value: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      hiddenVars: [], // 不需要展示占位符${REPAYMENT_H5}
      smsContent: {
        tpUdl: 0, // 字符数,
        notGsm7: null, // 非gsm7bit编码的字符数,
        tpud: null, // 拆分内容,
        sensitiveWords: null, // 敏感词,
        templateCode: '' // 模板ID
      },
      formData: {
        channel: '',
        templateName: '',
        templateContent: ''
      },
      rules: {
        channel: [{ required: true, trigger: 'blur' }],
        templateName: [{ required: true, trigger: 'blur' }],
        templateContent: [{ required: true, trigger: 'blur' }]
      },
      textAreaSize: {
        minRows: 2
      }
    }
  },

  watch: {
    showDialog: function (val, oldVal) {
      if (val === oldVal) return
      if (val === true) {
        this.formData.channel = this.channel
        if (this.isEdit) {
          this.$nextTick(() => {
            if (this.formData.templateContent) {
              // this.validationShortMsg(this.formData, 'noMessage')
            }
          })
        } else {
          this.smsContent = this.$options.data().smsContent
        }
      }
    },
    value: function (val, oldVal) {
      if (val === oldVal) return
      if (!_.isEmpty(val)) {
        this.formData.templateName = this.value.templateName
        this.formData.templateContent = this.value.templateContent
      } else {
        this.formData.templateName = ''
        this.formData.templateContent = ''
      }
    },
    vars(val, oldVal) {
      if (val === oldVal) return
      this.hiddenVars = val.filter((item) => item !== '${REPAYMENT_H5}')
    }
  },
  methods: {
    closeDialog() {
      this.$refs['smsTemplate'].clearValidate()
      this.$emit('update:showDialog', false)
    },
    cancel() {
      this.$refs['smsTemplate'].clearValidate()
      this.$emit('update:showDialog', false)
    },
    submit() {
      this.$refs['smsTemplate'].validate((valid) => {
        if (valid) {
          // this.validationShortMsg(this.formData)
        }
      })
    },
    // 先进行短信模板检测,检测完毕符合条件后进行提交
    // validationShortMsg(formData, type) {
    //   let data = JSON.parse(JSON.stringify(formData))
    //   let params = {
    //     sender_type: 'notification', // 通知：notification 营销：marketing
    //     content: data.templateContent // 短信内容
    //   }
    //   validationShortMsg(params)
    //     .then((res) => {
    //       let {
    //         tp_udl: tpUdl,
    //         not_gsm7: notGsm7,
    //         tpud,
    //         sensitive_words: sensitiveWords,
    //         template_code: templateCode
    //       } = res.data.data
    //       this.smsContent.tpUdl = tpUdl // 字符数
    //       this.smsContent.notGsm7 = notGsm7 // 非gsm7bit编码的字符数
    //       this.smsContent.tpud = tpud // 拆分内容
    //       this.smsContent.sensitiveWords = sensitiveWords // 敏感词
    //       this.smsContent.templateCode = templateCode // 模板ID
    //       // if ((tpud && tpud.length > 3) || (notGsm7 && notGsm7.length > 0) || (sensitiveWords && sensitiveWords.length > 0)) {
    //       //   // 请注意按照检测结果优化短信内容或格式
    //       //   this.$message({
    //       //     message: "Please optimize the content according to the test results",
    //       //     type: "error"
    //       //   });
    //       //   return false
    //       // } else {
    //       // submit
    //       if (!type) {
    //         let callback = () => {
    //           this.$refs['smsTemplate'].resetFields()
    //           this.$message({
    //             message: 'Submit successfully',
    //             type: 'success'
    //           })
    //         }
    //         this.$emit('submit', data, callback)
    //         this.$emit('update:showDialog', false)
    //       }
    //       // }
    //     })
    //     .catch((e) => {
    //       console.log('error')
    //     })
    // },
    // 模板规范详情页
    toTemRulesEN() {
      this.$emit('update:showDialog', false)
      this.$router.push({
        path: '/tools/smsTemRulesEN'
      })
    },
    copyText(text) {
      let _this = this
      //复制号码到剪切板
      navigator.clipboard
        .writeText(text)
        .then(function () {
          _this.$message({
            message: 'copy success'
          })
        })
        .catch(function () {
          _this.$message({
            message: 'copy error'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.sms-template {
  width: 100%;
}
.sms-template /deep/ .el-dialog {
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
          line-height: inherit;
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
    .el-button.no_border {
      border-width: 0;
      margin-right: 30px;
    }
  }
}

.item_sms_content {
  & > span {
    padding-right: 15px;
  }
  .red {
    color: #f56c6c;
  }
}
.var {
  background: #f3f3f3;
  padding: 3px 4px;
  margin-right: 5px;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  &__list {
    width: 100%;
    box-sizing: border-box;
    padding-left: 143px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
