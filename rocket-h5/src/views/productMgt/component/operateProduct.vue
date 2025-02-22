<template>
  <div>
    <header-title
      :title="operateType === 'create' ? '新增产品' : '编辑产品'"
    ></header-title>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="产品名称" prop="product_name">
        <el-input
          v-model="ruleForm.product_name"
          placeholder="请填写产品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="产品ID" prop="product_id">
        <el-input
          v-model="ruleForm.product_id"
          placeholder="请填写产品ID"
        ></el-input>
      </el-form-item>
      <el-form-item label="上架渠道" prop="publish_channels">
        <el-checkbox-group
          v-model="ruleForm.publish_channels"
          @change="publishChannelChange"
        >
          <el-checkbox
            v-for="item in channelList"
            :label="item.value"
            :key="item.value"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="choose-content" v-if="ruleForm.action_type === 'API_VIEW'">
        <el-col :span="4">
          <el-form-item label="是否半流程" prop="is_half_api">
            <el-radio-group
              v-model="ruleForm.is_half_api"
              @change="isHalfApiChange"
            >
              <el-radio
                v-for="item in radioList"
                :label="item.value"
                :key="item.value"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" class="isprofile">
          <el-form-item label="是否需要扩展资料" prop="has_extend_profile">
            <el-radio-group
              v-model="ruleForm.has_extend_profile"
              @change="hasExtendProfileChange"
            >
              <el-radio
                v-for="item in radioList"
                :label="item.value"
                :key="item.value"
              >
                {{ item.name }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </div>
      <!-- <el-form-item label="产品类别" prop="product_grade">
        <el-select v-model="ruleForm.product_grade" placeholder="请选择">
          <el-option
            v-for="(item, index) in gradeList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="规则编码" prop="recall_rule_code">
        <el-select v-model="ruleForm.recall_rule_code" placeholder="请选择">
          <el-option
            v-for="(item, index) in ruleList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <div class="choose-content">
        <el-form-item label="进件类型" prop="product_type">
          <el-select
            v-model="ruleForm.product_type"
            placeholder="请选择"
            @change="changeType"
          >
            <el-option label="H5" value="H5"></el-option>
            <el-option label="API" value="API"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="主体选择"
          prop="product_group"
          v-if="ruleForm.product_type === 'API'"
        >
          <el-select v-model="ruleForm.product_group" placeholder="请选择">
            <el-option
              v-for="(item, index) in productGroupList"
              :key="index"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="公司名称" prop="company">
        <el-input
          type="textarea"
          v-model="ruleForm.company"
          placeholder="请填写公司名称(选填)"
          maxlength="500"
          :autosize="{ minRows: 1, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item label="最高可借" prop="max_loan_amount">
        <el-input
          type="number"
          value="number"
          v-model.trim="ruleForm.max_loan_amount"
          placeholder="请输入最高可借额度"
        ></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input
          v-model="ruleForm.intro"
          placeholder="请输入简介"
          type="textarea"
          :row="3"
        ></el-input>
      </el-form-item>
      <el-form-item label="跳转类型" prop="action_type">
        <el-select v-model="ruleForm.action_type" placeholder="请选择">
          <el-option
            v-for="item in jumpTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="产品ID"
        prop="product_id"
        v-if="ruleForm.action_type === 'API_VIEW'"
      >
        <el-input
          disabled
          v-model="ruleForm.product_id"
          placeholder="请填写产品ID"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="应用"
        prop="action_package_name"
        v-if="ruleForm.action_type === 'SCHEME'"
      >
        <el-select v-model="ruleForm.action_package_name" placeholder="请选择">
          <el-option
            v-for="item in applicationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接" prop="action_data">
        <el-input
          v-model="ruleForm.action_data"
          placeholder="请输入跳转链接"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="上传图片"
        prop="img_url"
        :class="{ hiddenErrorTip: showTip }"
      >
        <ImportList
          @getBinaryData="getPictureBinaryData"
          purpose="image"
          :getParentImg="ruleForm.img_url"
          ref="imgImport"
        />
      </el-form-item>
      <el-form-item
        label="推广员"
        prop="promoter_aid"
        :style="{ 'margin-top': '45px' }"
      >
        <el-select v-model="ruleForm.promoter_aid" placeholder="请选择">
          <el-option
            v-for="item in promoterList"
            :key="item.aid"
            :label="item.admin_name"
            :value="item.aid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="甲方" prop="cp_id">
        <el-select v-model="ruleForm.cp_id" placeholder="请选择">
          <el-option
            v-for="item in cpList"
            :key="item.cp_id"
            :label="item.cp_name"
            :value="item.cp_id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上架国家" prop="country_code">
        <el-select
          v-model="ruleForm.country_code"
          placeholder="请选择"
          disabled
        >
          <el-option
            v-for="item in nationList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客服地址" prop="cs_url">
        <el-input
          v-model="ruleForm.cs_url"
          placeholder="请填写客服地址"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">
          确定
        </el-button>
        <el-button @click="backLastPage()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ImportList from '@/components/bfs/importList'
import HeaderTitle from '@/components/manage/headerTitle.vue'
import {
  addProduct,
  editProduct,
  getSingleProductInfo,
  getPromoterList,
  getCpList,
  getChannel
} from '@/api/manage/productManage'
const nationList = [{ value: 'NG', label: 'NG' }]
const jumpH5List = [
  { value: 'NO_ACTION', label: '不跳转' },
  { value: 'WEB_VIEW', label: '内嵌浏览器' },
  { value: 'SCHEME', label: '外部应用' }
]
// const gradeList = [
//   { value: 1, label: '一类' },
//   { value: 2, label: '二类' },
//   { value: 3, label: '三类' },
//   { value: 4, label: '四类' }
// ]
const ruleList = [
  { value: '000', label: '000' },
  { value: '001', label: '001' },
  { value: '002', label: '002' },
  { value: '003', label: '003' },
  { value: '004', label: '004' },
  { value: '005', label: '005' }
]
const jumpApiList = [{ value: 'API_VIEW', label: 'API进件' }]
const applicationList = [
  { value: '', label: '系统浏览器(短链)' },
  { value: 'com.android.vending', label: '谷歌应用市场' }
]

export default {
  name: 'OpeateProduct',
  components: { ImportList, HeaderTitle },
  data() {
    const validateAmount = (rule, value, callback) => {
      if (value) {
        const reg = /^(0|[1-9]\d*00)$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('可借额度应为100的整数格式'))
        }
      } else {
        callback(new Error('请填写最高可借额度'))
      }
    }
    return {
      showTip: false,
      // gradeList: gradeList,
      ruleList: ruleList,
      jumpH5List: jumpH5List,
      jumpApiList: jumpApiList,
      applicationList: applicationList,
      nationList: nationList,
      jumpTypeList: [],
      operateType: 'modify',
      ruleForm: {
        product_name: '',
        product_type: 'H5',
        product_group: '',
        // product_grade: '',
        recall_rule_code: '',
        company: '',
        max_loan_amount: '',
        intro: '',
        action_data: '',
        img_url: '',
        cp_id: '',
        country_code: 'NG',
        promoter_aid: '',
        action_type: '',
        product_id: '',
        action_package_name: '',
        cs_url: '', // 客服地址
        publish_channels: [], // 上架渠道
        is_half_api: 2, // 是否半流程API
        has_extend_profile: 2 // 是否有扩展资料
      },
      rules: {
        product_name: [
          {
            required: true,
            message: '请输入产品名称',
            trigger: 'blur',
            placeholder: '请输入'
          },
          { min: 1, max: 50, message: '长度不超过50个字符', trigger: 'blur' }
        ],
        // product_grade: [
        //   { required: true, message: '请选择产品类别', trigger: 'change' }
        // ],
        recall_rule_code: [
          { required: true, message: '请选择规则编码', trigger: 'change' }
        ],
        product_type: [
          { required: true, message: '请选择产品类型', trigger: 'change' }
        ],
        product_group: [
          { required: true, message: '请选择主体选择', trigger: 'change' }
        ],
        product_id: [
          { required: true, message: '请填写产品ID', trigger: 'blur' }
        ],
        action_type: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        max_loan_amount: [
          {
            required: true,
            message: '请填写最高可借额度',
            trigger: 'blur',
            validator: validateAmount
          },
          { validator: validateAmount, trigger: 'change' }
        ],
        intro: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        action_data: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' }
        ],
        img_url: [{ required: true, message: '请选择图片', trigger: 'change' }],
        promoter_aid: [
          { required: true, message: '请选择推广员', trigger: 'change' }
        ],
        cp_id: [{ required: true, message: '请选择甲方', trigger: 'change' }],
        cs_url: [
          { required: true, message: '请输入客服地址', trigger: 'blur' }
        ],
        publish_channels: [
          { required: true, message: '请选择上架渠道', trigger: 'change' }
        ],
        is_half_api: [{ required: true, message: '请选择', trigger: 'change' }],
        has_extend_profile: [
          { required: true, message: '请选择', trigger: 'change' }
        ]
      },
      promoterList: [],
      cpList: [],
      productGroupList: [
        { name: 'Fezotech', value: 'allcredit' },
        { name: 'Moblaspay', value: 'allcredit_1' }
      ],
      radioList: [
        { value: 1, name: '是' },
        { value: 2, name: '否' }
      ],
      channelList: [] // 上架渠道
    }
  },
  watch: {
    'ruleForm.product_type': {
      handler(v) {
        this.$set(this.rules['product_id'][0], 'required', v === 'API')
        v === 'API'
          ? (this.jumpTypeList = this.jumpApiList)
          : (this.jumpTypeList = this.jumpH5List)
      },
      deep: true,
      immediate: true
    },
    'ruleForm.action_type': {
      handler(v) {
        this.$set(this.rules['action_data'][0], 'required', v !== 'NO_ACTION')
      },
      deep: true,
      immediate: true
    },
    'ruleForm.img_url': {
      handler(v) {
        this.showTip = v.length > 0
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (Object.keys(this.$route.query).length) {
      // 判断是创建模板还是修改模板
      if (this.$route.query.type) {
        this.operateType = this.$route.query.type
      } else {
        this.operateType = 'modify'
      }
      if (this.$route.query.pid) {
        let productID = this.$route.query.pid
        this.initEditData(productID)
      }
    }
    this.queryPromoterList()
    this.queryCpList()
    this.getPublishChannel()
  },
  methods: {
    publishChannelChange(v) {
      this.ruleForm.publish_channels = v
    },
    isHalfApiChange(v) {
      this.ruleForm.is_half_api = v
    },
    hasExtendProfileChange(v) {
      this.ruleForm.has_extend_profile = v
    },
    changeType(v) {
      this.ruleForm.action_type = ''
      if (v === 'API') {
        this.ruleForm.action_type = 'API_VIEW'
      }
    },
    // 获取上架渠道列表
    getPublishChannel() {
      getChannel()
        .then((res) => {
          // console.log('上架渠道列表', res.data)
          if (res.status && res.status.code === 0) {
            this.channelList = res.data.publish_channels
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 获取推广员列表
    queryPromoterList() {
      getPromoterList()
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.promoterList = res.data.promoters || []
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 获取甲方列表
    queryCpList() {
      getCpList()
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            this.cpList = data.cps || []
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    initEditData(id) {
      let _this = this
      getSingleProductInfo({ data: { pid: id } })
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            Object.assign(_this.ruleForm, data)
            if (_this.ruleForm.action_type === 'API_VIEW') {
              let urlInfo = _this.ruleForm.action_data.split(',') || []
              _this.ruleForm.product_id = urlInfo[0]
              _this.ruleForm.action_data = urlInfo[1]
            }
          }
        })
        .catch((e) => {
          console.log('error')
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitResult()
        } else {
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
        let obj = JSON.parse(JSON.stringify(this.ruleForm))
        let data = {
          data: Object.assign({}, obj, {
            max_loan_amount: Number(obj.max_loan_amount),
            // product_grade: Number(obj.product_grade),
            // recall_rule_code: Number(obj.recall_rule_code),
            action_data:
              obj.action_type === 'API_VIEW'
                ? obj.product_id + ',' + obj.action_data
                : obj.action_data
          })
        }
        this.operateType === 'create'
          ? this.addNewProductInfo(data)
          : this.editProduct(data)
      })
    },
    //获取图片
    getPictureBinaryData(data) {
      this.ruleForm.img_url = data.fileUrl
    },
    addNewProductInfo(data) {
      addProduct(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.go(-1)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    editProduct(data) {
      editProduct(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.go(-1)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    backLastPage() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.choose-content {
  display: flex;
}
.isprofile {
  /deep/ .el-form-item__label {
    width: 220px !important;
  }
}
</style>
<style lang="scss">
.hiddenErrorTip {
  .el-form-item__content .el-form-item__error {
    display: none;
  }
}
</style>
