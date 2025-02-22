<template>
  <div class="productFactory-container">
    <el-form
      :model="productForms"
      :rules="productRules"
      ref="productForms"
      label-width="145px"
      class="product-factory"
    >
      <el-form-item label="ProductName" prop="productName" style="width: 800px">
        <el-input
          v-model="productForms.productName"
          placeholder="Please enter a productName"
        ></el-input>
      </el-form-item>
      <el-form-item label="ProductID" prop="productId" style="width: 800px">
        <el-input
          v-model="productForms.productId"
          placeholder="Please enter a productId"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="ProductFeeId"
        prop="productFeeId"
        style="width: 800px"
      >
        <el-input
          v-model="productForms.productFeeId"
          placeholder="Please enter a productFeeId"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="ProductChannel"
        prop="productChannel"
        style="width: 800px"
      >
        <el-input
          v-model="productForms.productChannel"
          placeholder="Please enter a productChannel"
        ></el-input>
      </el-form-item>
      <el-form-item label="AcctType" prop="acctType" style="width: 800px">
        <el-input
          v-model="productForms.acctType"
          placeholder="Please enter a acctType"
        ></el-input>
      </el-form-item>
      <el-form-item label="LoanType" prop="loanType">
        <el-radio-group v-model="productForms.loanType">
          <el-radio label="Single-period"></el-radio>
          <el-radio label="Multi-period"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="LmtType" prop="lmtType">
        <el-radio-group v-model="productForms.lmtType">
          <el-radio label="Single-period"></el-radio>
          <el-radio label="Multi-period"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Term" prop="term" style="width: 800px">
        <el-input
          v-model="productForms.term"
          placeholder="Please enter a term"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="CustomerLevel"
        prop="customerLevel"
        style="width: 800px"
      >
        <el-input
          v-model="productForms.customerLevel"
          placeholder="Please enter a customerLevel"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item
        label="SvcFeeCollMethod"
        prop="svcFeeCollMethod"
        style="width: 800px"
      >
        <el-input
          v-model="productForms.svcFeeCollMethod"
          placeholder="Please enter a SvcFeeCollMetho"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="SvcFeeCollMethod" prop="svcFeeCollMethod">
        <el-select
          style="width: 500px"
          v-model="productForms.svcFeeCollMethod"
          placeholder="Please enter a SvcFeeCollMetho"
        >
          <el-option label="precharge" value="P"></el-option>
          <el-option label="Postcharge" value="F"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SvcFeeRate" prop="svcFeeRate" style="width: 800px">
        <el-input
          v-model="productForms.svcFeeRate"
          placeholder="Please enter a svcFeeRate"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="ProductID" prop="productId">
        <el-select v-model="productForms.productId" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-col :span="11">
          <el-form-item prop="date1">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="productForms.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="date2">
            <el-time-picker
              placeholder="选择时间"
              v-model="productForms.date2"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="productForms.delivery"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质" prop="type">
        <el-checkbox-group v-model="productForms.type">
          <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
          <el-checkbox label="地推活动" name="type"></el-checkbox>
          <el-checkbox label="线下主题活动" name="type"></el-checkbox>
          <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="特殊资源" prop="resource">
        <el-radio-group v-model="productForms.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动形式" prop="desc">
        <el-input type="textarea" v-model="productForms.desc"></el-input>
      </el-form-item>  -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('productForms')"
          >Create it now</el-button
        >
        <el-button @click="resetForm('productForms')">reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// productChannel
import { mapGetters } from "vuex";
import { createAndSaveProduct } from "../../api/bas/user";
import DateRangePicker from "@/components/DateRangePicker.vue";

export default {
  name: "ProductFactory",
  components: {
    DateRangePicker,
  },
  data() {
    return {
      productForms: {
        productName: "",
        productId: "",
        productFeeId: "",
        productChannel: "",
        acctType: "",
        loanType: "", // 借款类型 OOP 单期 EPI 多期
        lmtType: "", // 额度类型 single 单期 multi 多期
        term: "",
        customerLevel: "", //用户等级，多个等级用逗号分隔
        svcFeeCollMethod: "", //P表示前置收费，F表示后置收费
        svcFeeRate: void 0, //服务费率
      },
      productRules: {
        productName: [
          {
            required: true,
            message: "Please enter a productName",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "Lengths range from 3 to 20 characters",
            trigger: "blur",
          },
        ],
        productId: [
          {
            required: true,
            message: "Please enter a productId",
            trigger: "change",
          },
        ],
        productFeeId: [
          {
            required: true,
            message: "Please enter a productFeeId",
            trigger: "change",
          },
        ],
        // productChannel: "",
        productChannel: [
          {
            required: true,
            message: "Please enter a productChannel",
            trigger: "change",
          },
        ],
        acctType: [
          {
            required: true,
            message: "Please enter a acctType",
            trigger: "change",
          },
        ],
        loanType: [{ required: true, message: "", trigger: "change" }],

        lmtType: [{ required: true, message: "", trigger: "change" }],
        term: [
          {
            required: true,
            message: "Please enter a term",
            trigger: "change",
          },
        ],
        customerLevel: [
          {
            required: true,
            message: "Please enter a customerLevel",
            trigger: "change",
          },
        ],
        svcFeeCollMethod: [
          {
            required: true,
            message: "Please enter a svcFeeCollMethod",
            trigger: "change",
          },
        ],
        svcFeeRate: [
          {
            required: true,
            message: "Please enter a svcFeeRate",
            trigger: "change",
          },
        ],
      },
      data: {
        data: {},
      },
    };
  },
  computed: {
    // "productForms.loanType": function (newVal) {
    //   this.productForms.lmtType = newVal;
    // },
    // "productForms.lmtType": function (newVal) {
    //   this.productForms.loanType = newVal;
    // },
    // "productForms.loanType": function (newVal) {
    //   if (newVal == "Single-period") {
    //     this.productForms.loanType = "OOP";
    //     console.log("A", this.productForms.loanType);
    //   } else if (newVal == "Multi-period") {
    //     this.productForms.loanType = "EPI";
    //     console.log("A-A", this.productForms.loanType);
    //   }
    // },
    // "productForms.lmtType": function (newVal) {
    //   if (newVal == "Single-period") {
    //     this.productForms.lmtType = "single";
    //     console.log("A", this.productForms.lmtType);
    //   } else if (newVal == "Multi-period") {
    //     this.productForms.lmtType = "multi";
    //     console.log("A-A", this.productForms.lmtType);
    //   }
    // },
  },
  created() {},
  mounted() {
    console.log("Initializing productforms:", this.productforms);
  },
  watch: {
    // "productForms.loanType": function (newVal) {
    //   this.productForms.lmtType = newVal;
    // },
    // "productForms.lmtType": function (newVal) {
    //   this.productForms.loanType = newVal;
    // },
    // "productForms.loanType": function (newVal) {
    //   if (newVal == "Single-period") {
    //     this.productForms.loanType = "OOP";
    //     console.log("A-watch", this.productForms.loanType);
    //   } else if (newVal == "Multi-period") {
    //     this.productForms.loanType = "EPI";
    //     console.log("A-A-watch-loanType", this.productForms.loanType);
    //   }
    // },
    // "productForms.lmtType": function (newVal) {
    //   if (newVal == "Single-period") {
    //     this.productForms.lmtType = "single";
    //     console.log("A-watch", this.productForms.lmtType);
    //   } else if (newVal == "Multi-period") {
    //     this.productForms.lmtType = "multi";
    //     console.log("A-A-lmtType", this.productForms.lmtType);
    //   }
    // },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // 复制表单数据
          const formData = { ...this.productForms };
          // 转换 loanType 和 LmtType 值

          this.productForms.loanType =
            this.productForms.loanType == "Single-period" ? "OOP" : "EPI";
          this.productForms.lmtType =
            this.productForms.lmtType == "Single-period" ? "single" : "multi";
          this.productForms.svcFeeRate = Number(this.productForms.svcFeeRate);
          this.data.data = this.productForms;
          console.log("formData", this.data, this.formData, this.productForms);
          const res = await createAndSaveProduct(this.data);
          if (res.status.code == 0) {
            console.log("create successful", res);
            const h = this.$createElement;
            this.$message({
              message: h("p", null, [
                h("span", null, "The create was successful"),
                h("i", { style: "color: teal" }, "VNode"),
              ]),
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
