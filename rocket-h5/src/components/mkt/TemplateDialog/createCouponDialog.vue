<!--
	作者：ganshengqu
	时间：2020-07-06
	描述：IVR创建
-->
<template>
  <div class="create-dialog">
    <el-dialog
      title="优惠券预览"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
      :destroy-on-close="true"
      :append-to-body="true"
    >
      <el-form
        :model="form"
        ref="formDom"
        class="clearfix"
        label-width="140px"
        label-position="left"
        v-loading="formLoading"
        :disabled="actionType === 'preview'"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优惠券名称：" prop="couponName">
              <el-input
                v-model="form.couponName"
                autocomplete="off"
                maxlength="20"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="券所属业务线：" prop="product">
              <el-select v-model="form.product" placeholder>
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
            <el-form-item label="券类型：" prop="couponMethod">
              <el-select v-model="form.couponMethod" placeholder>
                <el-option label="满减利息券" value="A"></el-option>
                <el-option label="利息折扣券" value="R"></el-option>
                <el-option label="利息天数减免券" value="D"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="面额："
              prop="denominations"
              v-if="form.couponMethod == 'R'"
            >
              <el-input
                v-model="form.denominations"
                autocomplete="off"
              ></el-input>
              <span style="margin-left: 10px">%</span>
            </el-form-item>
            <el-form-item
              label="面额："
              prop="denominations"
              v-else-if="form.couponMethod == 'D'"
            >
              <el-input
                v-model="form.denominations"
                autocomplete="off"
                onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
              >
                <el-button slot="append">₦</el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="面额：" prop="denominations" v-else>
              <el-input
                v-model="form.denominations"
                autocomplete="off"
                onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
              >
                <el-button slot="append">₦</el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠方式：" prop="preferentialWay">
              <el-select v-model="form.preferentialWay" placeholder>
                <el-option label="立减" value="U"></el-option>
                <el-option label="满减" value="C"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用产品（时长）:">
              <el-select
                v-model="form.reducedDays"
                placeholder
                :disabled="form.couponMethod == 'U'"
              >
                <el-option label="All" value=""></el-option>
                <el-option label="7D" value="7"></el-option>
                <el-option label="14D" value="14"></el-option>
                <el-option label="21D" value="21"></el-option>
                <el-option label="28D" value="28"></el-option>
                <el-option label="2T" value="60"></el-option>
                <el-option label="3T" value="90"></el-option>
                <el-option label="4T" value="120"></el-option>
                <el-option label="5T" value="150"></el-option>
                <el-option label="6T" value="180"></el-option>
                <el-option label="7T" value="210"></el-option>
                <el-option label="8T" value="240"></el-option>
                <el-option label="9T" value="270"></el-option>
                <el-option label="10T" value="300"></el-option>
                <el-option label="11T" value="330"></el-option>
                <el-option label="12T" value="360"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低金额：">
              <el-input
                v-model="form.reducedAmount"
                autocomplete="off"
                :disabled="form.couponMethod == 'U'"
                onKeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { queryCouponTemplate } from '@/api/mkt/template.js'
import { getProduct } from '@/api/mkt/stragety.js'
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
      type: String,
      default: 'preview'
    },
    actionID: {
      type: String
    }
  },
  data() {
    return {
      productList: [],
      //创建共用一个接口（绑定统一表单对象）
      form: {
        couponName: '',
        couponMethod: 'A',
        preferentialWay: '',
        denominations: '',
        reducedAmount: '',
        reducedDays: '',
        aliveDay: '',
        effectiveDate: '',
        expiryDate: '',
        product: '',
        createUser: ''
      },
      formLoading: false
    }
  },
  watch: {
    dialogShow(val) {
      val && this.actionType !== 'create' && this.getOriData(this.actionID)
      if (val) this.getProduct()
    }
  },
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
    // this.getProduct();
    //this.actionType !== "create" && this.getOriData();
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
    getOriData(actionID) {
      this.formLoading = true
      queryCouponTemplate({
        data: actionID
      })
        .then((res) => {
          Object.assign(this.form, res.data)
        })
        .catch((e) => {
          console.log('error')
        })
        .finally((e) => {
          this.formLoading = false
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
