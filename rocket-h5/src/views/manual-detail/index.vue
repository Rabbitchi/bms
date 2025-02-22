<template>
  <div class="detail-container">
    <div class="header-title">
      <i
        class="el-icon-caret-left"
        style="font-size: 24px; padding: 15px 0px; float: left"
        @click="gotoback"
      >
        Back
      </i>
    </div>
    <el-form
      :model="manualdetailForm"
      label-width="245px"
      class="manual-detail-page"
      :rules="manualformrules"
      ref="manualdetailForm"
    >
      <el-form-item label="loanID" style="width: 800px">
        <el-input
          v-model="manualdetailForm.loanId"
          placeholder="loanID"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="custID" style="width: 800px">
        <el-input
          v-model="manualdetailForm.custId"
          placeholder="custID"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="offlineId" style="width: 800px">
        <el-input
          v-model="manualdetailForm.offlineId"
          placeholder="Please enter a offlineId"
        ></el-input>
      </el-form-item>
      <el-form-item label="Amount" style="width: 800px">
        <el-input
          v-model="manualdetailForm.amount"
          placeholder="Please enter a Amount"
        ></el-input>
      </el-form-item>
      <!-- 获取当前时间戳new Date().getTime(); 默认是当前时间，但是可选   -->
      <el-form-item label="transDate">
        <el-col :span="11">
          <el-form-item prop="transDate">
            <el-date-picker
              type="date"
              placeholder="Select a date"
              v-model="manualdetailForm.transDate"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="transDate" style="width: 800px">
        <el-input
          v-model="manualdetailForm.transDate"
          placeholder="transDate"
          disabled
        ></el-input>
      </el-form-item> -->
      <el-form-item class="search-button" style="display: flex">
        <el-button class="search-button-one" type="primary" @click="OnSubmit">
          Submit
        </el-button>
        <el-button class="clear-button" type="primary" @click="clearForm">
          Clear
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { manualRepaysubmit } from "../../api/bas/user";

export default {
  name: "Detail",
  data() {
    return {
      data: {
        data: {},
      },
      manualdetailForm: {
        custId: "",
        loanId: "",
        offlineId: "",
        amount: void 0,
        transDate: "",
      },
      timer: null,
      manualformrules: {
        offlineId: [
          {
            required: true,
            message: "Please enter a offlineId",
            trigger: "change",
          },
        ],
        Amount: [
          {
            required: true,
            message: "Please enter a Amount",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        let loanId = JSON.parse(localStorage.getItem("loanId"));
        console.log(
          "路由变化了222",
          this.$route,
          to,
          from,
          JSON.parse(localStorage.getItem("loanId"))
        );
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["name"]),
    loanId() {
      console.log("vuex-offlineId", this.$store.state.userinfo.offlineId);
      return this.$store.state.userinfo.offlineId;
    },
    custId() {
      console.log("vuex-custId", this.$store.state.userinfo.custId);
      return this.$store.state.userinfo.custId;
    },
    selectedInfoItem() {
      console.log("vuex-data111", this.$store.state.userinfo.selectedInfoItem);
      //拿vuex数据展示
      return JSON.parse(localStorage.getItem("keydata"))[0];
    },
  },
  created() {},
  mounted() {
    // this.manualdetailForm.offlineId = this.$store.state.userinfo.offlineId;

    this.manualdetailForm.loanId = this.$store.state.userinfo.offlineId;
    this.manualdetailForm.custId = this.$store.state.userinfo.custId;
    this.manualdetailForm.transDate = this.formatDate(new Date().getTime());
    // new Date().getTime();
    console.log(
      "detail-route",
      this.manualdetailForm,
      this.$route,
      this.$route.query.id
    );
  },
  methods: {
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月份从0开始，需要加1，并且用0补齐两位   数
      const day = ("0" + date.getDate()).slice(-2); // 用0补齐两位数
      return `${year}-${month}-${day}`;
    },
    async OnSubmit() {
      this.manualdetailForm.amount = Number(this.manualdetailForm.amount);
      this.manualdetailForm.offlineId = Number(this.manualdetailForm.offlineId);
      delete this.manualdetailForm["loanId"];
      this.manualdetailForm.transDate = this.formatDate(
        this.manualdetailForm.transDate
      );
      this.data.data = this.manualdetailForm;
      console.log("onsubmit-form", this.manualdetailForm);
      const res = await manualRepaysubmit(this.data);
      if (res.status.code == 0) {
        console.log("OnSubmit", res.data);
        const h = this.$createElement;
        this.$message({
          message: h("p", null, [
            h("span", null, "The submission was successful"),
            h("i", { style: "color: teal" }, "VNode"),
          ]),
        });
      }
    },
    clearForm() {
      this.manualdetailForm.amount = null;
      this.manualdetailForm.transDate = null;
      this.manualdetailForm.offlineId = null;
    },
    gotoback() {
      this.$router.go(-1); // 后退到上一页
    },
  },
};
</script>

<style lang="scss" scoped>
.manual-detail-page {
  background-color: #fff;
  padding-top: 100px;
  padding-bottom: 100px;
}
.el-form-item {
  text-align: center;
}
.information-detail {
  margin-top: 20px;
  height: calc(100vh-100px);
  padding: 16px;
  background: #fff;
}
.el-form-item__label {
  padding: 78px 12px 0 0 !important;
}
.title-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #364150;
  font-size: 20px;
}
.line {
  width: 200px !important;
}

.detail {
  &-box {
    text-align: center;
    display: flex;
    width: 830px;
    height: 100px;
    margin: auto;
  }
  .detail-container {
    position: relative;
    background-color: #615200 !important;
    color: rgb(197, 202, 207);
    border-radius: 4px !important;
    margin-top: -30px !important;
    background-color: #f9f9f9;
  }
  .review-btn {
    position: absolute;
    bottom: 0;
    right: 100px;
    margin-left: 0px !important;
  }
  .header-title {
    display: block;
    width: 200px;
    height: 50px;
    // justify-content: center;
    // align-items: center;
  }
  .detail-container .el-icon-caret-left {
    float: left !important;
    width: 10px;
    height: 10px;
  }
  .el-icon-caret-left:before {
    font-size: 20px !important;
    padding-right: 100px;
  }
  &-container {
    text-align: center;
    margin-top: 15px;
  }
  &-text {
    flex: 2;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial,
      sans-serif;
    font-size: 30px;
    line-height: 46px;
    line-height: 50px;
    text-align: left;
    font-weight: 500;
  }
  &-title {
    flex: 1;
    background: #364150;
    color: #fff;
    font-size: 60px;
    line-height: 100px;
    padding: 0 50px;
    margin-right: 30px;
    font-weight: 600;
  }
  &-img {
    flex: 1;
    img {
      animation: roll-in-top 1.1s both;
      width: 100px;
      margin-right: 15px;
    }
  }
}
.picture-right-top {
  // position: absolute;
  // top: 100px;
  // right: 300px;
  padding: 18px 12px 0 0 !important;
}
.picture-right {
  position: absolute;
  top: 200px;
  right: 300px;
}
.el-form-line {
  width: 350px;
}
.roll-in-top {
  -webkit-animation: roll-in-top 0.6s ease-out both;
  animation: roll-in-top 0.6s ease-out both;
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
        margin-right: 143px !important;
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
    content: " ";
    clear: both;
    height: 0;
  }
}
@-webkit-keyframes roll-in-top {
  0% {
    -webkit-transform: translateY(-800px) rotate(-540deg);
    transform: translateY(-800px) rotate(-540deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotate(0deg);
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
}
@keyframes roll-in-top {
  0% {
    -webkit-transform: translateY(-800px) rotate(-540deg);
    transform: translateY(-800px) rotate(-540deg);
    opacity: 0;
  }
  100% {
    -webkit-transform: translateY(0) rotate(0deg);
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
}
</style>
