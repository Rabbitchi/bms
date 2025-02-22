<!--
	作者：ganshengqu
	时间：2020-07-06
	描述：短信创建
-->
<template>
  <div class="create-dialog">
    <el-dialog
      :title="`短信模板`"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
      :destroy-on-close="true"
      :append-to-body="actionType === 'preview'"
      :modal-append-to-body="actionType === 'preview'"
    >
      <el-form
        ref="smsCreateform"
        :rules="formRules"
        :model="formObj"
        label-width="140px"
        label-position="left"
        v-loading="formLoading"
        :disabled="actionType === 'preview'"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              label="短信标题/模板名称"
              prop="name"
              class="item_sms_title"
              :required="true"
            >
              <el-input
                v-model="formObj.name"
                maxlength="10"
                show-word-limit
                :disabled="disabledStatus"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板分类: " prop="categoryId" :required="true">
              <el-select v-model="formObj.categoryId" placeholder>
                <el-option
                  v-for="item in selectOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  {{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务线: " prop="product">
              <el-select v-model="formObj.product" placeholder>
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="短信内容"
              prop="content"
              class="item_sms_content"
              :required="true"
            >
              <el-input
                type="textarea"
                placeholder="请输入内容"
                :disabled="disabledStatus"
                show-word-limit
                maxlength="459"
                v-model="formObj.content"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
              <p class="item_sms_content_test">
                <span class="item_sms_count_all">
                  字符数：{{ smsContent.tpUdl }}
                </span>
                <span
                  class="item_sms_count_slitting"
                  :class="{
                    red: smsContent.tpud && smsContent.tpud.length >= 3
                  }"
                >
                  分条数：{{ smsContent.tpud ? smsContent.tpud.length : 0 }}
                </span>
                <span
                  class="item_sms_count_unicode red"
                  v-if="smsContent.notGsm7 && smsContent.notGsm7.length > 0"
                >
                  非gsm字符数：{{ smsContent.notGsm7.length }}
                  (
                  <span
                    v-for="(item, index) in smsContent.notGsm7"
                    :key="index"
                  >
                    {{ item }}
                    <template v-if="index !== smsContent.notGsm7.length - 1">
                      ,
                    </template>
                  </span>
                  )
                </span>
                <span v-else class="item_sms_count_unicode">
                  非gsm字符数：0
                </span>
                <span
                  class="red"
                  v-if="
                    smsContent.sensitiveWords &&
                    smsContent.sensitiveWords.length > 0
                  "
                >
                  敏感字符数：{{ smsContent.sensitiveWords.length }}
                  (
                  <span
                    v-for="(item, index) in smsContent.sensitiveWords"
                    :key="index"
                  >
                    {{ item }}
                    <template
                      v-if="index !== smsContent.sensitiveWords.length - 1"
                    >
                      ,
                    </template>
                  </span>
                  )
                </span>
                <span v-else>敏感字符数：0</span>
              </p>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large">
              <el-button type="primary" @click="onSubmit('smsCreateform')">
                提交
              </el-button>
              <el-button @click="cancelDailog">取消</el-button>
              <el-button
                v-if="showTemTestDetail"
                type="text"
                @click="toTemTestDetail"
              >
                模板检测详情
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getProduct } from '@/api/mkt/stragety.js'
import { mapGetters } from 'vuex'
import {
  createSMSTemplate,
  editSMSTemplate,
  querySMSTemplate,
  querySMSCategoryList
} from '@/api/mkt/template.js'
export default {
  components: {},
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    disabledStatus: {
      type: Boolean,
      default: false
    },
    checkRowObj: {
      type: Object,
      default: () => {}
    },
    actionType: {
      // 有三个枚举值, preview, create, modify
      type: String,
      default: 'create'
    },
    templateCode: {
      type: String,
      default: ''
    },
    actionID: {
      type: String
    }
  },
  data() {
    //校验短信标题/模板名称、短信内容
    var validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入短信标题/模板名称'))
      } else {
        callback()
      }
      // setTimeout(() => {
      //   var chPattern = /^[A-Za-z0-9  \!\%\@\#\$\^\&\*\-\_\+\=\:\\\'\;\,\.\/\?\(\)\{\}\[\]\<\>\s]*$/;
      //   if (!chPattern.test(value)) {
      //     callback(new Error("支持英文字母，数字，特殊字符"));
      //   } else {
      //     callback();
      //   }
      // }, 1000);
    }
    //校验内容
    var validateContent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写短信内容'))
      } else {
        callback()
      }
      // setTimeout(() => {
      //   var chPattern = /^[A-Za-z0-9  \!\%\@\#\$\^\&\*\-\_\+\=\:\\\'\;\,\.\/\?\(\)\{\}\[\]\<\>\s]*$/;
      //   if (!chPattern.test(value)) {
      //     callback(new Error("支持英文字母，数字，特殊字符"));
      //   } else {
      //     callback();
      //   }
      // }, 1000);
    }
    return {
      productList: [],
      smsContent: {
        tpUdl: 0, // 字符数,
        notGsm7: null, // 非gsm7bit编码的字符数,
        tpud: null, // 拆分内容,
        sensitiveWords: null, // 敏感词,
        templateCode: '' // 模板ID
      },
      showTemTestDetail: false, // 显示模板检测详情
      //创建共用一个接口（绑定统一表单对象）
      formObj: {
        name: '',
        content: '',
        product: '',
        categoryId: ''
      },
      formLoading: false,
      //筛选用总数
      filterUserTotal: null,
      //服务消息筛选
      filterUserDialog: false,
      //短信校验规则
      formRules: {
        name: [{ validator: validateTitle, trigger: 'blur' }],
        content: [{ validator: validateContent, trigger: 'blur' }],
        product: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ]
      },
      selectOptions: []
    }
  },
  computed: {
    ...mapGetters(['name'])
    // setTitle() {
    //   if (this.disabledStatus) {
    //     return "查看短信模板";
    //   } else {
    //     return "创建短信模板";
    //   }
    // }
  },
  watch: {
    // disabledStatus: {
    //   handler(val, oldVal) {
    //     if (val) {
    //       this.formObj = this.checkRowObj;
    //     } else {
    //       //将原始对象的值
    //       this.formObj = this.$options.data().formObj;
    //     }
    //     //清空触发的表单校验
    //     if (this.$refs["smsCreateform"] !== undefined) {
    //       this.$refs["smsCreateform"].resetFields();
    //     }
    //   },
    //   deep: true, //true 深度监听
    //   immediate: true //立即执行
    // }
    dialogShow(val) {
      this.smsContent = this.$options.data().smsContent
      this.showTemTestDetail = false
      val && this.actionType !== 'create' && this.getOriData(this.actionID)
      this.querySelectOptions()
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
    toTemTestDetail() {
      if (this.formObj.content) {
        // 短信内容缓存
        sessionStorage.setItem('sms-test-content', JSON.stringify(this.formObj))
      } else {
        this.$message({
          message: '内容不能为空',
          type: 'error'
        })
        return false
      }
      this.cancelDailog()
      this.$router.push({
        path: '/ReachChannelConfiguration/smsTestDetial',
        query: {
          actionType: this.actionType,
          actionID: this.actionID ? this.actionID : undefined,
          from: this.$route.path
        }
      })
      // 新开页面
      // let routeData = this.$router.resolve({path: "/ReachChannelConfiguration/smsTestDetial"});
      // window.open(routeData.href, '_blank');
    },
    getOriData(actionID) {
      this.formLoading = true
      querySMSTemplate({
        data: actionID
      })
        .then((res) => {
          Object.assign(this.formObj, res.data)
        })
        .catch((e) => {
          console.log('error')
        })
        .finally((e) => {
          this.formLoading = false
        })
    },
    querySelectOptions() {
      querySMSCategoryList()
        .then((res) => {
          this.selectOptions = res.data
        })
        .catch((e) => {
          console.log('error')
        })
    },
    onSubmit(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(1)
          _this.submitFormData()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelDailog() {
      this.$emit('cancelDailog', false)
      if (this.$refs['smsCreateform'] !== undefined) {
        this.$refs['smsCreateform'].resetFields()
      }
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      if (this.$refs['smsCreateform'] !== undefined) {
        this.$refs['smsCreateform'].resetFields()
      }
    },
    //请求创建接口
    submitFormData() {
      let _this = this
      let data = {
        data: _this.formObj
      }
      if (this.templateCode) {
        data.data.templateCode = this.templateCode
      }
      let func = ''
      if (this.actionType === 'modify') {
        data.data.id = this.actionID
        func = editSMSTemplate
      } else {
        func = createSMSTemplate
      }
      console.log(func)
      this.formLoading = true
      func(data)
        .then((res) => {
          if (res.data == null) {
            //提交成功时，清空弹窗数据
            let obj = _this.formObj
            Object.keys(obj).forEach((key) => (obj[key] = ''))
            _this.cancelDailog()
            _this.$emit('createdSuccess', false)
            //toast提示
            _this.$message({
              message: '创建成功',
              type: 'success'
            })
            //清空弹窗触发change的校验
            _this.$refs['smsCreateform'].resetFields()
          }
          console.log(res)
          let {
            tp_udl: tpUdl,
            not_gsm7: notGsm7,
            tpud,
            sensitive_words: sensitiveWords,
            template_code: templateCode
          } = res.data
          _this.$nextTick(() => {
            _this.smsContent.tpUdl = tpUdl // 字符数
            _this.smsContent.notGsm7 = notGsm7
            _this.smsContent.tpud = tpud // 拆分内容
            _this.smsContent.sensitiveWords = sensitiveWords
            if (templateCode) _this.smsContent.templateCode = templateCode
            if (
              (tpud && tpud.length >= 3) ||
              (notGsm7 && notGsm7.length > 0) ||
              (sensitiveWords && sensitiveWords.length) > 0
            ) {
              this.showTemTestDetail = true
              // 请注意按照检测结果优化短信内容或格式
              _this.$message({
                message: '请注意按照检测结果优化短信内容或格式',
                type: 'error'
              })
              return false
            } else {
              // //提交成功时，清空弹窗数据
              // let obj = _this.formObj;
              // Object.keys(obj).forEach((key) => (obj[key] = ""));
              // _this.cancelDailog();
              // _this.$emit("createdSuccess", false);
              // //toast提示
              // _this.$message({
              //   message: "创建成功",
              //   type: "success"
              // });
              // //清空弹窗触发change的校验
              // _this.$refs["smsCreateform"].resetFields();
            }
          })
        })
        .catch((e) => {
          console.log('error')
        })
        .finally((e) => {
          this.formLoading = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.create-dialog {
  ::v-deep .el-collapse-item__wrap {
    background: #eee;
    padding: 20px 10px;
    border-radius: 20px;
  }
  ::v-deep .el-collapse-item__content {
    padding: 0;
  }
  width: 100%;
  /deep/ .special {
    width: 40%;
    display: inline-block;
  }

  ::v-deep .el-form-item {
    margin: 10px;
  }

  .pTitleRight {
    width: 150px;
    height: 150px;
    border: 1px dashed #c1c1c1;
    border-radius: 10px;
    overflow: hidden;
    line-height: 150px;
    text-align: center;
    position: relative;
    display: block;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .upload_cover {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      line-height: 150px;
      i {
        font-size: 22px;
        color: #ffffff;
        cursor: pointer;
        display: none;
      }
      i.el-icon-zoom-in {
        margin-right: 25px;
      }
    }
    .upload_cover:hover {
      background: rgba(0, 0, 0, 0.2);
      i {
        display: inline-block;
      }
    }
  }
  .userTotal {
    margin-left: 40px;
    .bold {
      font-weight: 600;
    }
  }
}
.el-date-picker {
  .el-button--text {
    display: none !important;
    color: red;
  }
}
.item_sms_content_test {
  & > span {
    padding-right: 15px;
  }
  .red {
    cursor: pointer;
    color: #f56c6c;
  }
}
</style>
