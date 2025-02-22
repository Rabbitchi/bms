<template>
  <div class="sms-template">
     短信
     <!-- <sms-template></sms-template> -->
     <sms-template
     :showDialog.sync="showSmsDialog"
     :isEdit="isEditMode"
     :channel="channelValue"
     :vars="templateVars"
     :value="currentTemplate"
     @submit="handleTemplateSubmit"
     @cancel="showSmsDialog = false"
   ></sms-template>
   <button @click="handele()">rrrrrrrr</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { createAndSaveProduct ,downloadBMDTemplate} from "../../api/bas/user";
import DateRangePicker from "@/components/DateRangePicker.vue";

import SmsTemplate from '@/components/cncs/smsTemplate.vue';

export default {
  name: "SMSandFILE",
  components: {
    DateRangePicker,
    SmsTemplate
  },
  data() {
    return {
      showSmsDialog: false,
      isEditMode: false,
      channelValue: 'Kashcash',
      templateVars: ['${REPAYMENT_H5}'],
      currentTemplate: {
        templateName: '',
        templateContent: ''
      },
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
  },
  created() {},
  mounted() {
    console.log("Initializing productforms:", this.productforms);
  },
  watch: {

  },
  methods: {
    handele(){
      window.location.href = "http://test-app.antpesa.vip/ent-web/web/v1/downloadBMDTemplate"

    },
    async handleTemplateSubmit(data) {
      // 处理表单提交逻辑"
      console.log(data);
      // 可能需要调用后端API保存模板
      this.showSmsDialog = false;
      // const res = await downloadBMDTemplate(this.data);
      // console.log("create successful-000", res);
    },
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
          const res = await downloadBMDTemplate(this.data);
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
