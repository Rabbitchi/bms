<!--
	作者：ganshengqu
	时间：2020-07-06
	描述：IVR创建
-->
<template>
  <div class="create-dialog">
    <el-dialog
      :title="`IVR 模板`"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <el-form
        ref="IVRCreateform"
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
              label="模板名称"
              prop="name"
              class="item_IVR_title"
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
          <el-col :span="12">
            <el-form-item label="任务ID" prop="taskId" :required="true">
              <el-input
                placeholder="请输入内容"
                :disabled="disabledStatus"
                v-model="formObj.taskId"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话前缀" prop="extNum" :required="true">
              <el-input
                placeholder="请输入内容"
                :disabled="disabledStatus"
                v-model="formObj.extNum"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large">
              <el-button type="primary" @click="onSubmit('IVRCreateform')">
                提交
              </el-button>
              <el-button @click="cancelDailog">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProduct } from '@/api/mkt/stragety.js'
import {
  createIVRTemplate,
  editIVRTemplate,
  queryIVRTemplate,
  queryIVRCategoryList
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
    actionID: {
      type: String
    }
  },
  data() {
    //校验IVR标题/模板名称、IVR内容
    var validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入IVR标题/模板名称'))
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
        return callback(new Error('请填写IVR内容'))
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
      //创建共用一个接口（绑定统一表单对象）
      formObj: {
        name: '',
        taskId: '',
        extNum: '',
        product: '',
        categoryId: ''
      },
      formLoading: false,
      //IVR校验规则
      formRules: {
        name: [{ validator: validateTitle, trigger: 'blur' }],
        taskId: [{ validator: validateContent, trigger: 'blur' }],
        extNum: [
          { required: true, message: '请选择所属业务', trigger: 'blur' }
        ],
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
    //     return "查看 IVR 模板";
    //   } else {
    //     return "创建 IVR 模板";
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
    //     if (this.$refs["IVRCreateform"] !== undefined) {
    //       this.$refs["IVRCreateform"].resetFields();
    //     }
    //   },
    //   deep: true, //true 深度监听
    //   immediate: true //立即执行
    // }
    dialogShow(val) {
      this.querySelectOptions()
      val && this.actionType !== 'create' && this.getOriData(this.actionID)
      if (val) this.getProduct()
    }
  },
  mounted() {},
  created() {
    // this.productList = [
    //   "PalmCredit22",
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
    querySelectOptions() {
      queryIVRCategoryList()
        .then((res) => {
          console.log(res.data)
          this.selectOptions = res.data
          console.log(this.selectOptions)
        })
        .catch((e) => {
          console.log('error')
        })
    },
    getOriData(actionID) {
      this.formLoading = true
      queryIVRTemplate({
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
    onSubmit(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.savePushMsg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelDailog() {
      this.$emit('cancelDailog', false)
      if (this.$refs['IVRCreateform'] !== undefined) {
        this.$refs['IVRCreateform'].resetFields()
      }
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      if (this.$refs['IVRCreateform'] !== undefined) {
        this.$refs['IVRCreateform'].resetFields()
      }
    },
    //请求创建接口
    savePushMsg() {
      let _this = this
      let data = {
        data: _this.formObj
      }
      let func = ''
      if (this.actionType === 'modify') {
        data.data.id = this.actionID
        func = editIVRTemplate
      } else {
        func = createIVRTemplate
      }
      this.formLoading = true

      func(data)
        .then((res) => {
          console.log(res)
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
          _this.$refs['IVRCreateform'].resetFields()
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
</style>
