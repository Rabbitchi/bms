<template>
  <div class="display-container">
    <header-title :title="'编辑产品展示策略'"></header-title>
    <p :style="{ 'text-align': 'center' }">
      <img :src="ruleForm.img_url" alt="" class="logo" />
    </p>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
    >
      <el-form-item label="产品名称" prop="product_name">
        <el-input v-model="ruleForm.product_name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="weight">
        <el-input
          type="number"
          value="number"
          v-model="ruleForm.weight"
          placeholder="请填写1-200数字,数字越大排在越前"
        ></el-input>
      </el-form-item>
      <el-form-item label="预设UV" prop="uv_quota_per_day">
        <el-input
          type="text"
          value="number"
          maxlength="7"
          v-model="ruleForm.uv_quota_per_day"
          placeholder="请输入本日预设UV"
        ></el-input>
      </el-form-item>
      <el-form-item label="本日UV" prop="uv_on_today">
        <el-input v-model="ruleForm.uv_on_today" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="单价" prop="uv_price">
        <el-input
          type="text"
          value="number"
          maxlength="7"
          v-model="ruleForm.uv_price"
          placeholder="请输入UV单价"
        ></el-input>
      </el-form-item>
      <el-form-item label="展示时间" prop="date">
        <el-date-picker
          v-model="ruleForm.date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          end-placeholder="结束时间"
        ></el-date-picker>
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
import HeaderTitle from '@/components/manage/headerTitle.vue'
import {
  editProductAds,
  getSingleProductAdsInfo
} from '@/api/manage/operatingManage'
export default {
  components: { HeaderTitle },
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
    const validateUv = (rule, value, callback) => {
      if (value !== null || value !== undefined) {
        const reg = /^\+?(0|[1-9][0-9]*)$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('UV值应为0或正整数'))
        }
      } else {
        callback(new Error('请输入UV值'))
      }
    }
    return {
      ruleForm: {
        product_name: '',
        weight: '',
        uv_quota_per_day: '',
        uv_on_today: '',
        uv_price: '',
        date: [],
        img_url: ''
      },
      rules: {
        weight: [
          {
            required: true,
            message: '请填写1-200数字，数字越大越靠前',
            trigger: 'blur'
          },
          { validator: validateWeight, trigger: 'change' }
        ],
        uv_quota_per_day: [
          {
            required: true,
            message: '请输入预设UV',
            trigger: 'blur'
          },
          { validator: validateUv, trigger: 'change' }
        ],
        uv_price: [
          {
            required: true,
            message: '请输入UV单价',
            trigger: 'blur'
          },
          { validator: validateUv, trigger: 'change' }
        ],
        date: [
          {
            type: 'array',
            required: true,
            message: '请选择展示时间',
            fields: {
              0: { type: 'string', required: true, message: '请选择展示时间' },
              1: { type: 'string', required: true, message: '请选择展示时间' }
            }
          }
        ]
      }
    }
  },
  created() {
    if (Object.keys(this.$route.query).length) {
      if (this.$route.query.pid) {
        let productID = this.$route.query.pid
        this.initEditData(productID)
      }
    }
  },
  methods: {
    // 单个查询信息
    initEditData(id) {
      let _this = this
      getSingleProductAdsInfo({ data: { pid: id } })
        .then(function (res) {
          if (res.status && res.status.code === 0) {
            let { data } = res
            Object.assign(_this.ruleForm, data)
            _this.ruleForm.date = [
              data.begin_ads_time_fmt,
              data.end_ads_time_fmt
            ]
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
          return false
        }
      })
    },
    editProductAds(data) {
      editProductAds(data)
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
    submitResult() {
      this.$confirm('确认是否提交?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = JSON.parse(JSON.stringify(this.ruleForm))
        let data = {
          data: Object.assign({}, obj, {
            begin_ads_time_fmt: obj.date[0],
            end_ads_time_fmt: obj.date[1],
            weight: Number(obj.weight),
            uv_price: Number(obj.uv_price),
            uv_quota_per_day: Number(obj.uv_quota_per_day)
          })
        }
        delete data.data.date
        this.editProductAds(data)
      })
    },
    backLastPage() {
      this.$router.go(-1)
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
}
</style>
