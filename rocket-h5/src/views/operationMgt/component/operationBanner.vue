<template>
  <div class="display-container">
    <header-title
      :title="operateType === 'modify' ? '编辑banner' : '新增banner'"
    ></header-title>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item
        label="上传图片"
        prop="img_url"
        :class="{ hiddenErrorTip: showTip }"
      >
        <ImportList
          @getBinaryData="getPictureBinaryData"
          :getParentImg="ruleForm.img_url"
          purpose="image"
          ref="imgImport"
        />
      </el-form-item>
      <el-form-item label="名称" prop="banner_name">
        <el-input v-model="ruleForm.banner_name"></el-input>
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
      <el-form-item label="排序" prop="weight">
        <el-input
          v-model="ruleForm.weight"
          type="number"
          value="number"
        ></el-input>
      </el-form-item>
      <div class="actiontype-box">
        <el-form-item label="跳转类型" prop="action_type">
          <el-select
            v-model="ruleForm.action_type"
            placeholder="请选择"
            @change="actionTypeChange"
          >
            <el-option
              v-for="item in jumpTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="产品"
          prop="productName"
          v-if="queryProductList.length > 0"
        >
          <el-select
            v-model="productName"
            placeholder="请选择"
            @change="productIdChange"
          >
            <el-option
              v-for="item in queryProductList"
              :key="item.pid"
              :label="item.product_name"
              :value="item.product_name"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
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
      <el-form-item
        label="产品ID"
        prop="productId"
        v-if="ruleForm.action_type === 'API_VIEW'"
      >
        <el-input v-model="ruleForm.productId" disabled></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="action_data">
        <el-input
          v-model="ruleForm.action_data"
          placeholder="请输入跳转链接"
        ></el-input>
        <span class="preview" @click="preview">预览</span>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
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
  getSingleBannerInfo,
  editBanner,
  addBanner
} from '@/api/manage/operatingManage'
import {
  getProductList,
  getSingleProductInfo,
  getChannel
} from '@/api/manage/productManage'

const jumpTypeList = [
  { value: 'NO_ACTION', label: '不跳转' },
  { value: 'WEB_VIEW', label: '内嵌浏览器' },
  { value: 'SCHEME', label: '外部应用' },
  { value: 'API_VIEW', label: 'API进件' }
]
const applicationList = [
  { value: '', label: '系统浏览器(短链)' },
  { value: 'com.android.vending', label: '谷歌应用市场' }
]
const nationList = [{ value: 'NG', label: 'NG' }]
export default {
  components: { HeaderTitle, ImportList },
  data() {
    const validateWeight = (rule, value, callback) => {
      if (value) {
        const reg = /^(\d|[1-9]\d|1\d{2}|200)$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('排序值可填1-200'))
        }
      } else {
        callback(new Error('请填写1-200数字，数字越大越靠前'))
      }
    }
    return {
      showTip: false,
      applicationList: applicationList,
      jumpTypeList: jumpTypeList,
      nationList: nationList,
      operateType: 'modify',
      queryProductList: [], // 跳转类型为API进件--API或外部应用--H5时，查询产品列表（已上架）
      currentProduct: {}, // 编辑时，当前选择的产品对象
      ruleForm: {
        banner_name: '',
        action_type: '',
        action_data: '',
        action_package_name: '',
        weight: '',
        remark: '',
        img_url: '',
        productId: '', // 产品ID
        country_code: 'NG',
        publish_channels: [] // 上架渠道
      },
      productName: '',
      rules: {
        img_url: [{ required: true, message: '请先上传图片', trigger: 'blur' }],
        banner_name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        productId: [
          { required: true, message: '请输入产品ID', trigger: 'blur' }
        ],
        weight: [
          {
            required: true,
            message: '请填写1-200数字，数字越大越靠前',
            trigger: 'blur'
          },
          { validator: validateWeight, trigger: 'change' }
        ],
        action_data: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' }
        ],
        action_type: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        publish_channels: [
          { required: true, message: '请选择上架渠道', trigger: 'change' }
        ]
      },
      channelList: [] // 上架渠道
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
      if (this.$route.query.bannerId) {
        let bannerID = this.$route.query.bannerId
        this.initEditData(bannerID)
      }
    }
    this.getPublishChannel()
  },
  watch: {
    'ruleForm.img_url': {
      handler(v) {
        this.showTip = v.length > 0
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
    }
  },
  methods: {
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
    publishChannelChange(v) {
      this.ruleForm.publish_channels = v
    },
    // 单个查询信息
    initEditData(id) {
      getSingleBannerInfo({ data: { banner_id: id } })
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            Object.assign(this.ruleForm, data)
            this.ruleForm.date = [
              data.begin_ads_time_fmt,
              data.end_ads_time_fmt
            ]
            if (this.ruleForm.action_type === 'API_VIEW') {
              let urlInfo = this.ruleForm.action_data.split(',') || []
              this.ruleForm.productId = urlInfo[0]
              this.ruleForm.action_data = urlInfo[1]
              this.actionTypeChange('API_VIEW')
            } else if (this.ruleForm.action_type === 'SCHEME') {
              this.actionTypeChange('SCHEME')
            }
          }
        })
        .catch((e) => {
          console.log(e)
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
        let obj = JSON.parse(JSON.stringify(this.ruleForm))
        let data = {
          data: Object.assign(
            {},
            obj,
            { weight: Number(obj.weight) },
            {
              action_data:
                obj.action_type === 'API_VIEW'
                  ? obj.productId + ',' + obj.action_data
                  : obj.action_data
            },
            { pid: this.currentProduct ? this.currentProduct.pid : '' }
          )
        }
        delete data.data.date
        if (obj.productId) delete data.data.productId
        // console.log('请求数据 data', data.data)
        this.operateType === 'create'
          ? this.addBannerInfo(data)
          : this.editBannerInfo(data)
      })
    },
    addBannerInfo(data) {
      addBanner(data)
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
    editBannerInfo(data) {
      editBanner(data)
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
    //获取图片
    getPictureBinaryData(data) {
      this.ruleForm.img_url = data.fileUrl
    },
    preview() {
      if (!this.ruleForm.action_data) {
        this.$message.error('请先填写跳转链接!')
        return false
      }
      window.open(this.ruleForm.action_data, '_blank')
    },
    backLastPage() {
      this.$router.go(-1)
    },
    actionTypeChange(key) {
      console.log(key)
      if (key === 'API_VIEW' || key === 'SCHEME') {
        const productType = key === 'API_VIEW' ? 'API' : 'H5'
        let param = {
          data: {
            product_name: '',
            product_grade: '',
            product_type: productType,
            company: '',
            promoter_aid: '',
            status: 1, // 状态。0：all，1: 上架，2: 下架。
            begin_create_time_fmt: '',
            end_create_time_fmt: '',
            page_size: 99999,
            page_index: 0
          }
        }
        getProductList(param)
          .then((res) => {
            if (res.status && res.status.code === 0) {
              let { data } = res
              console.log('产品列表', data.product_list)
              console.log('this.ruleForm', this.ruleForm)
              if (data.total > 0) {
                this.queryProductList = data.product_list

                let product = {}
                this.queryProductList.map((item) => {
                  if (item.pid === this.ruleForm.pid) {
                    product = item
                  }
                })
                if (Object.getOwnPropertyNames(product).length === 0) {
                  this.currentProduct = this.queryProductList[0]
                }

                this.productName = this.currentProduct.product_name
                this.queryProductObjByPid()
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        this.queryProductList = []
        this.currentProduct = null
        this.ruleForm.productId = ''
        this.ruleForm.action_data = ''
        this.ruleForm.action_package_name = ''
      }
    },
    productIdChange(key) {
      this.currentProduct = this.queryProductList.filter((item) => {
        return item.product_name === key
      })
      this.currentProduct = this.currentProduct[0]

      this.queryProductObjByPid()
    },
    queryProductObjByPid() {
      let pid = this.currentProduct.pid
      getSingleProductInfo({ data: { pid: pid } })
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            console.log('当前product 对象', data)
            this.ruleForm.action_package_name = data.action_package_name
            this.ruleForm.action_data = data.action_data
            if (data.action_type === 'API_VIEW') {
              let urlInfo = this.ruleForm.action_data.split(',') || []
              this.ruleForm.productId = urlInfo[0]
              this.ruleForm.action_data = urlInfo[1]
            }
          }
        })
        .catch((e) => {
          console.log('error')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.display-container {
  .logo {
    width: 90px;
    height: 90px;
  }

  .preview {
    cursor: pointer;
    color: rgb(11, 11, 255);
    margin-left: 10px;
  }
  ::v-deep .el-input {
    width: 90%;
  }

  .actiontype-box {
    display: flex;
  }
}
</style>
