<!--
	作者：ganshengqu
	时间：2020-05-26
	描述：编辑创建弹窗
-->
<template>
  <div class="create-dialog">
    <el-dialog
      title="APP 消息模板"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
      :append-to-body="true"
      top="100px"
      :destroy-on-close="true"
    >
      <el-form
        ref="outerForm"
        :rules="outerFormRules"
        :model="outerForm"
        label-width="100px"
        label-position="left"
        :disabled="actionType === 'preview'"
        v-loading="formLoading"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题: " prop="name">
              <el-input v-model="outerForm.name" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务线: " prop="product">
              <el-select v-model="outerForm.product" placeholder>
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板分类: " prop="categoryId">
              <el-select v-model="outerForm.categoryId" placeholder>
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
        </el-row>
        <el-row>
          <el-form-item label="消息类型: " prop="activeName">
            <el-checkbox-group v-model="outerForm.activeName">
              <el-checkbox label="service_msg" name="service_msg">
                服务消息
              </el-checkbox>
              <el-checkbox
                label="preferential_activity"
                name="preferential_activity"
              >
                优惠活动
              </el-checkbox>
              <el-checkbox label="system_notice" name="system_notice">
                系统公告
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-row>

        <el-divider />

        <el-collapse v-model="outerForm.activeName">
          <el-form
            ref="serviceForm"
            :rules="serviceFormRules"
            :model="serviceForm"
            label-width="100px"
            :disabled="actionType === 'preview'"
          >
            <el-collapse-item
              class="dialogCollapse"
              :disabled="!outerForm.activeName.includes('service_msg')"
              title="服务消息"
              name="service_msg"
            >
              <template slot="title">
                <i class="header-icon el-icon-edit-outline"></i>
                服务消息
              </template>
              <el-form-item label="Push标题" prop="pushTitle">
                <el-input
                  v-model="serviceForm.pushTitle"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="Push内容" prop="pushContent">
                <el-input
                  type="textarea"
                  placeholder="请输入内容"
                  maxlength="200"
                  v-model="serviceForm.pushContent"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                ></el-input>
              </el-form-item>

              <el-form-item label="跳转类型" prop="jumpType" class="special">
                <el-select
                  v-model="serviceForm.jumpType"
                  placeholder="请选择"
                  @change="
                    selectValue(serviceForm.jumpType, serviceForm.jumpPath)
                  "
                >
                  <el-option label="内部页面" value="innerJump"></el-option>
                  <el-option label="外部链接" value="h5Jump"></el-option>
                  <el-option label="不跳转" value="noJump"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="跳转路径"
                prop="jumpPath"
                v-if="serviceForm.jumpType !== 'noJump'"
                class="special"
              >
                <el-input
                  type="textarea"
                  autosize
                  placeholder="请输入链接地址"
                  v-model="serviceForm.jumpPath"
                  v-if="serviceForm.jumpType == 'h5Jump'"
                ></el-input>
                <el-select
                  v-model="serviceForm.jumpPath"
                  placeholder="请选择"
                  v-else
                >
                  <el-option label="APP首页" value="homeComponent"></el-option>
                  <el-option
                    label="Xcross主页"
                    value="xcrossComponent"
                  ></el-option>
                  <el-option
                    label="提现页"
                    value="taleCashComponent"
                  ></el-option>
                  <el-option label="还款页" value="myloanComponent"></el-option>
                  <el-option
                    label="绑账户申请页"
                    value="addBankAccountComponent"
                  ></el-option>
                  <el-option
                    label="绑卡申请页"
                    value="addBankCardComponent"
                  ></el-option>
                  <el-option
                    label="授信申请页"
                    value="creditPageComponent"
                  ></el-option>
                  <el-option
                    label="我的优惠券页"
                    value="myCouponComponent"
                  ></el-option>
                  <el-option
                    label="提额任务页"
                    value="creditLimitComponent"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-collapse-item>
            <!--优惠活动-->
            <el-collapse-item
              class="dialogCollapse"
              :disabled="
                !outerForm.activeName.includes('preferential_activity')
              "
              title="优惠活动"
              name="preferential_activity"
            >
              <template slot="title">
                <i class="header-icon el-icon-edit-outline"></i>
                优惠活动
              </template>
              <el-form
                ref="promotionsForm"
                :rules="promotionsFormRules"
                :model="promotionsForm"
                label-width="100px"
                :disabled="actionType === 'preview'"
              >
                <el-form-item label="Push标题" prop="pushTitle">
                  <el-input
                    v-model="promotionsForm.pushTitle"
                    maxlength="50"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Push内容" prop="pushContent">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    maxlength="200"
                    v-model="promotionsForm.pushContent"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  ></el-input>
                </el-form-item>

                <el-form-item label="跳转类型" prop="jumpType" class="special">
                  <el-select
                    v-model="promotionsForm.jumpType"
                    placeholder="请选择"
                    @change="selectValue(promotionsForm.jumpType.jumpPath)"
                  >
                    <el-option label="内部页面" value="innerJump"></el-option>
                    <el-option label="外部链接" value="h5Jump"></el-option>
                    <el-option label="不跳转" value="noJump"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="跳转路径"
                  prop="jumpPath"
                  v-if="promotionsForm.jumpType !== 'noJump'"
                  class="special"
                >
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入链接地址"
                    v-model="promotionsForm.jumpPath"
                    v-if="promotionsForm.jumpType == 'h5Jump'"
                  ></el-input>
                  <el-select
                    v-model="promotionsForm.jumpPath"
                    placeholder="请选择"
                    v-else
                  >
                    <el-option
                      label="APP首页"
                      value="homeComponent"
                    ></el-option>
                    <el-option
                      label="Xcross主页"
                      value="xcrossComponent"
                    ></el-option>
                    <el-option
                      label="提现页"
                      value="taleCashComponent"
                    ></el-option>
                    <el-option
                      label="还款页"
                      value="creditPageComponent"
                    ></el-option>
                    <el-option
                      label="绑账户申请页"
                      value="myloanComponent"
                    ></el-option>
                    <el-option
                      label="绑卡申请页"
                      value="addBankCardComponent"
                    ></el-option>
                    <el-option
                      label="授信申请页"
                      value="messageCenterComponent"
                    ></el-option>
                    <el-option
                      label="我的优惠券页"
                      value="myCouponComponent"
                    ></el-option>
                    <el-option
                      label="提额任务页"
                      value="creditLimitComponent"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="上传图片" :required="true">
                  <!--图片地址 promotionsForm.pictureUrl -->
                  <ImportList
                    @getBinaryData="getPictureBinaryData"
                    purpose="image"
                    ref="imgImport"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>
            <!--系统公告-->
            <el-collapse-item
              class="dialogCollapse"
              :disabled="!outerForm.activeName.includes('system_notice')"
              title="系统公告"
              name="system_notice"
            >
              <template slot="title">
                <i class="header-icon el-icon-edit-outline"></i>
                系统公告
              </template>
              <el-form
                ref="systemForm"
                :rules="systemFormRules"
                :model="systemForm"
                label-width="100px"
                :disabled="actionType === 'preview'"
              >
                <el-form-item label="Push标题" prop="pushTitle">
                  <el-input
                    v-model="systemForm.pushTitle"
                    maxlength="50"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Push内容" prop="pushContent">
                  <el-input
                    type="textarea"
                    placeholder="请输入内容"
                    maxlength="200"
                    v-model="systemForm.pushContent"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                  ></el-input>
                </el-form-item>

                <el-form-item label="署名" prop="signature">
                  <el-input
                    v-model="systemForm.signature"
                    maxlength="30"
                  ></el-input>
                </el-form-item>
                <el-form-item label="公告内容" :required="true">
                  <!--公告内容 systemForm.noticeContent  -->
                  <TinymceEditor
                    v-if="dialogShow"
                    @getContent="getContent"
                    :parentContent="systemForm.noticeContent"
                    ref="noticePushContnet"
                    :disabled="actionType === 'preview'"
                  />
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-form>
        </el-collapse>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="cancelDailog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import TinymceEditor from '@/components/TinymceEditor'
import ImportList from '@/components/bfs/importList'
import { mapGetters } from 'vuex'
import { getProduct } from '@/api/mkt/stragety.js'
import {
  createAppTemplate,
  editAppTemplate,
  queryAppTemplate,
  queryAppCategoryList
} from '@/api/mkt/template.js'

export default {
  components: { TinymceEditor, ImportList },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    actionType: {
      // 有三个枚举值, preview, create, modify
      type: String,
      default: 'create'
    },
    actionID: {
      type: String
    }
  },
  data() {
    return {
      productList: [],
      outerForm: {
        name: '',
        product: '',
        categoryId: '',
        activeName: []
      },
      serviceForm: {
        pushType: 'service_msg',
        pushTitle: '',
        pushContent: '',
        jumpPath: '',
        jumpType: ''
      },
      systemForm: {
        pushType: 'system_notice',
        pushTitle: '',
        pushContent: '',
        jumpPath: '',
        jumpType: '',
        signature: '',
        fileUrl: '',
        noticeContent: ''
      },
      promotionsForm: {
        pushType: 'preferential_activity',
        pushTitle: '',
        pushContent: '',
        jumpPath: '',
        jumpType: '',
        pictureUrl: ''
      },
      formLoading: false,
      selectOptions: [],
      fileName: '',
      //服务消息校验规则
      outerFormRules: {
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        product: [
          { required: true, message: '请选择业务线', trigger: 'change' }
        ],
        categoryId: [
          { required: true, message: '请选择模板分类', trigger: 'change' }
        ],
        activeName: [
          { required: true, message: '请选择消息类型', trigger: 'change' }
        ]
      },
      serviceFormRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],

        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpPath: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ]
      },
      //优惠活动校验规则
      promotionsFormRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],

        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpPath: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ]
      },
      //系统公告校验规则
      systemFormRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],

        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpPath: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ],

        signature: [
          { required: true, message: '请填写署名', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    dialogShow(val) {
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
    // this.getProduct();
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
    querySelectOptions() {
      queryAppCategoryList()
        .then((res) => {
          this.selectOptions = res.data
        })
        .catch((e) => {
          console.log('error')
        })
    },
    getOriData(actionID) {
      let _this = this
      this.formLoading = true
      queryAppTemplate({
        data: actionID
      })
        .then((res) => {
          Object.assign(_this.outerForm, res.data)
          if (res.data.details && res.data.details.length) {
            res.data.details.forEach((ele) => {
              _this.outerForm.activeName.push(ele.pushType)
              if (ele.pushType === 'service_msg') {
                Object.assign(_this.serviceForm, ele)
              }
              if (ele.pushType === 'system_notice') {
                Object.assign(_this.systemForm, ele)
              }
              if (ele.pushType === 'preferential_activity') {
                Object.assign(_this.promotionsForm, ele)
              }
            })
          }
        })
        .catch((e) => {
          console.log('error')
        })
        .finally((e) => {
          this.formLoading = false
        })
    },
    getContent(content) {
      this.systemForm.noticeContent = content
    },
    onSubmit() {
      let _this = this

      let validOuterForm = new Promise(function (resolve, reject) {
        _this.$refs['outerForm'] &&
          _this.$refs['outerForm'].validate((valid) => {
            if (valid) {
              resolve()
            }
          })
      })

      let validServiceForm = new Promise(function (resolve, reject) {
        _this.$refs['serviceForm'] &&
          _this.$refs['serviceForm'].validate((valid) => {
            if (valid) {
              resolve()
            }
          })
      })
      let validSystemForm = new Promise(function (resolve, reject) {
        _this.$refs['systemForm'] &&
          _this.$refs['systemForm'].validate((valid) => {
            if (valid) {
              resolve()
            }
          })
      })
      let validPromotionsForm = new Promise(function (resolve, reject) {
        _this.$refs['promotionsForm'] &&
          _this.$refs['promotionsForm'].validate((valid) => {
            if (valid) {
              resolve()
            }
          })
      })

      let formToCheck = [
        validOuterForm
        // validPromotionsForm,
        // validSystemForm,
        // validServiceForm
      ]

      let selectedType = this.outerForm.activeName
      let req = JSON.parse(JSON.stringify(this.outerForm))

      req.details = []

      if (selectedType.length) {
        selectedType.forEach(function (ele) {
          if (ele === 'preferential_activity') {
            formToCheck.push(validPromotionsForm)
            req.details.push(_this.promotionsForm)
          }
          if (ele === 'system_notice') {
            formToCheck.push(validSystemForm)
            req.details.push(_this.systemForm)
          }
          if (ele === 'service_msg') {
            formToCheck.push(validServiceForm)
            req.details.push(_this.serviceForm)
          }
        })
      }

      console.log(formToCheck)

      delete req.activeName
      Promise.all(formToCheck)
        .then(function () {
          _this.savePushMsg(req)
        })
        .catch((e) => {
          this.$message.error(`校检错误, 请检查输入框`)
          console.log(e)
        })
    },
    selectValue(e, jumpPath) {
      if (e === 'h5Jump') {
        jumpPath = ''
      }
    },
    cancelDailog() {
      this.clearFields()
      this.$emit('cancelDailog', 'APP')
    },
    dialogClose() {
      this.clearFields()
      this.$emit('cancelDailog', 'APP')
    },
    clearFields() {
      let _this = this
      let forms = ['outerForm', 'promotionsForm', 'serviceForm', 'systemForm']
      forms.forEach((e) => {
        _this.$refs[e].resetFields()
      })
    },
    //请求创建接口
    savePushMsg(req) {
      let _this = this
      let func = ''
      if (this.actionType === 'modify') {
        req.id = this.actionID
        func = editAppTemplate
      } else {
        func = createAppTemplate
      }
      this.formLoading = true

      func({ data: req })
        .then((res) => {
          _this.$message({
            type: 'success',
            message: `创建成功`
          })
          _this.cancelDailog()
          _this.$emit('createdSuccess', false)
        })
        .catch((e) => {
          console.log('error')
        })
        .finally((e) => {
          this.formLoading = false
        })
    },

    //导入名单
    importList() {
      this.dialogBatchImportVisible = true
    },
    //获取上传的excel表，返回的url
    getBinaryData(data) {
      this.promotionsForm.fileUrl = data.fileUrl
      this.fileName = data.fileName
    },
    //获取图片
    getPictureBinaryData(data) {
      this.promotionsForm.pictureUrl = data.fileUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.create-dialog {
  ::v-deep .el-collapse-item__content {
    padding: 0;
  }
  width: 100%;
  /deep/ .special {
    width: 40%;
    display: inline-block;
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
.el-icon-edit-outline {
  margin-right: 10px;
}
.dialogCollapse {
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px 30px;
  font-size: 14px;
  ::v-deep .el-collapse-item__header {
    font-size: 16px;
    border-bottom: none;
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
