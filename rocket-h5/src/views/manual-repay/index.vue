<template>
  <div class="newpage-container">
    <el-form :inline="true" :model="manualForm" class="demo-form-inline">
      <el-form-item label="loanID">
        <el-input
          v-model="manualForm.loanId"
          style="width: 180px"
          placeholder="loanID"
        ></el-input>
      </el-form-item>
      <el-form-item label="custID">
        <el-input
          v-model="manualForm.custId"
          style="width: 180px"
          placeholder="custID"
        ></el-input>
      </el-form-item>
      <el-form-item label="loanStatus">
        <el-input
          v-model="manualForm.loanStatus"
          style="width: 180px"
          placeholder="loanStatus"
        ></el-input>
      </el-form-item>
      <el-form-item class="search-button">
        <el-button
          class="search-button-one"
          type="primary"
          @click="onRepaySearch"
        >
          Search
        </el-button>
        <el-button class="clear-button" type="primary" @click="clearForm">
          Clear
        </el-button>
      </el-form-item>
    </el-form>
    <div class="newpage-info-list" style="height: 720px;">
      <el-descriptions title="manualrepay-List"></el-descriptions>
      <el-table
        v-loading="loading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :data="itemList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        style="width: 100%"
      >
        <el-table-column label="Index" fixed>
          <template slot-scope="scope">
            <!-- {{ (page.pageNum - 1) * page.pageSize + scope.$index + 1 }} -->
            {{ rowIndex + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          fixed="left"
          prop="loanId"
          label="loanID"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="custId"
          label="custId"
          width="280"
        ></el-table-column>
        <el-table-column
          prop="loanType"
          label="loanType"
          width="110"
        ></el-table-column>
        <!-- loanStatus -->
        <el-table-column
          prop="loanStatus"
          label="loanStatus"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="loanAmt"
          label="loanAmt"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="loanTerm"
          label="loanTerm"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="currTerm"
          label="currTerm"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="pastOutstdBal"
          label="pastOutstdBal"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="outstdBal"
          label="outstdBal"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="currOutstdBal"
          label="currOutstdBal"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="paidOffDate"
          label="paidOffDate"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="overdueDays"
          label="overdueDays"
          width="110"
        ></el-table-column>
        <el-table-column
          prop="nextDueDate"
          label="nextDueDate"
          width="180"
        ></el-table-column>
        <el-table-column fixed="right" label="Details" width="120">
          <template slot-scope="scope">
            <el-button
              @click="gotoManualDetail(scope.row)"
              type="text"
              size="small"
            >
              Operate
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :key="refreshKey"
        background
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { manualrepayserachList } from "../../api/bas/user";
import Cookies from "js-cookie";
import DateRangePicker from "@/components/DateRangePicker.vue";
import CryptoJS from "crypto-js";

export default {
  name: "ManualRepay",
  components: {
    DateRangePicker,
  },
  data() {
    return {
      loadingInstance : null,
      loading: true,
      manualForm: {
        loanId: "",
        custId: "",
        loanStatus: "",
        // 拒绝或退回原因
      },
      querydata: "",
      localstorageData: [],
      items: [{ id: 1, name: "Item 1", description: "Description 1" }],
      token: "",
      data: {
        page: {},
        data: {},
      },
      page: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0, // 总条目数，需要从后端获取
      itemList: [],
      refreshKey: 0,
      // manualquery: {}
    };
  },
  computed: {
    ...mapGetters(["name"]),
    rowIndex() {
      if (
        this.page &&
        typeof this.page.pageNum === "number" &&
        typeof this.page.pageSize === "number"
      ) {
        return (this.page.pageNum - 1) * this.page.pageSize;
      } else {
        console.error("Page data is invalid:", this.page);
        return 1; // 提供一个默认值
      }
    },
  },
  created() {
    this.validatePageNumber();
  },
  mounted() {
    console.log("Initializing manualForm:", this.manualForm);
    console.log("init", this.page, this.page.pageNum);
    if (isNaN(this.page.pageNum)) {
      console.error("pageNum is not a number, resetting to default");
      this.page.pageNum = 1; // 设置一个默认值以防万一
    }
    // this.data.data = this.manualForm
    //1.构建查询参数
    //1.1如果不是第一次加载先尝试从本地拿去查询参数---页码和查询参数
    let savedPage = JSON.parse(localStorage.getItem("manualCurrentPage"))
      ? JSON.parse(localStorage.getItem("manualCurrentPage"))
      : JSON.parse(localStorage.getItem("manualCurrentPageNum"));
    // let savedPage = JSON.parse(localStorage.getItem("manualCurrentPageNum"));
    let manualquery = JSON.parse(localStorage.getItem("manualquery"));
    //渲染的时候,条件框保留上次的参数
    if (manualquery) this.manualForm = manualquery;
    //1.2如果不是第一次加载从 localStorage 获取页码
    if (savedPage) {
      const hasValue =
        this.manualForm.loanId !== "" || this.manualForm.custId !== "";
      // 根据检查结果设置 pageNum
      if (hasValue) {
        this.page.pageNum = 1;
      } else {
        this.page.pageNum = parseInt(savedPage);
        this.refreshKey = this.page.pageNum;
        this.data.page = this.page;
      }
    } else {
      this.data.page = this.page;
      console.log("restorePageState-this.page", this.page.pageNum);
    }
    //1.3如果不是第一次加载就从localStorage拿查询条件
    if (manualquery) {
      this.data.data = manualquery;
    } else {
      console.log("init-init-data", this.manualForm);

      this.data.data = this.manualForm;
    }
    //2.根据查询参数调用查询方法
    console.log("init-init", this.data, this.manualForm);
    this.getUsersList(this.data);
    //3.这里进行强制更新pageNume
    this.$nextTick(() => {
      this.page.pageNum = parseInt(savedPage);
    });
  },
  watch: {
    $route: {
      // immediate:true,
      handler(to, from) {
        console.log(
          "路由变化了333",
          to,
          from,
          JSON.parse(localStorage.getItem("loanId"))
        );
        let loanId = JSON.parse(localStorage.getItem("loanId"));
        if (to.path === "/audit-management") {
          this.getUsersList(this.data);
          console.log("刷新");
        }
      },
      //  deep:true,
      immediate: true,
    },
    "page.pageNum": {
      handler: function (newVal, oldVal) {
        this.restorePageState();
        this.validatePageNumber();
        // this.handleCurrentChange(newVal)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 加密函数
    encrypt(text, key) {
      return CryptoJS.AES.encrypt(text, key).toString();
    },
    validatePageNumber() {
      if (isNaN(this.page.pageNum)) {
        console.error("Page number is NaN, resetting to default");
        this.page.pageNum = 1; // Reset to default or a safe value
      }
    },
    //用于检查是否存储成功
    checkStorage(key) {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        console.log("存储成功，存储的数据为:", JSON.parse(storedValue));
      } else {
        console.log("存储失败，没有找到对应的存储数据。");
      }
    },
    restorePageState() {
      // 尝试从 Local Storage 获取保存的页码
      const savedPage = localStorage.getItem("manualCurrentPage");
      console.log("restorePageState", savedPage, parseInt(savedPage, 10));
      // 如果存在保存的页码，则将其转换为整数并返回
      // 如果不存在，返回默认页码，比如 1
      return savedPage ? parseInt(savedPage, 10) : 1;
    },
    clearForm() {
      this.manualForm.loanId = "";
      this.manualForm.custId = "";
      this.manualForm.loanStatus = "";
    },
    checkFormValuesAndSetPage() {
      // 检查指定字段是否至少有一个不为空
      const hasValue =
        this.manualForm.loanId !== "" || this.manualForm.custId !== "";
      // 根据检查结果设置 pageNum
      if (hasValue) {
        this.page.pageNum = 1;
      } else {
        this.page.pageNum = this.restorePageState();
      }
    },
    onRepaySearch() {
      if (this.manualForm && typeof this.manualForm === "object") {
        Object.keys(this.manualForm).forEach((key) => {
          if (typeof this.manualForm[key] === "string") {
            this.manualForm[key] = this.manualForm[key].trim();
          }
        });
      } else {
        console.error(
          "manualForm is not initialized properly:",
          this.manualForm
        );
      }
      //1.查询参数为页码为默认值，，条件为入参
      this.checkFormValuesAndSetPage();
      // this.page.pageNum = this.restorePageState()
      if (this.page.pageNum && this.data.page && this.data.page.pageNum > 1) {
        this.page.pageNum = 1;
      }
      console.log("this.page", this.page);
      this.data.page = this.page;
      this.data.data = this.manualForm;
      this.getUsersList(this.data);

      //将搜索条件存储到localStrorge
      const manualquery = this.manualForm;
      //判断有没有存储成功
      if (manualquery) {
        try {
          let key = "manualquery";
          localStorage.setItem("manualquery", JSON.stringify(manualquery));
          console.log("尝试存储搜索条件...");
          this.checkStorage(key); // 检查存储是否成功
        } catch (error) {
          console.error("存储到localStorage失败: ", error);
        }
      }
    },
    // 用户改变每页显示的条目数时调用
    handleSizeChange(newSize) {
      //1需要构建查询参数---包括页码和查询条件
      this.page.pageSize = newSize;
      this.data.page = this.page;
      let manualquery = JSON.parse(localStorage.getItem("manualquery"));
      this.data.data = manualquery;
      //2调用查询函数
      this.getUsersList(this.data);
    },
    // 用户改变当前页码时调用
    handleCurrentChange(newPageNum) {
      //构造查询参数--包括页码--查询条件
      this.page.pageNum = newPageNum;
      this.data.page = this.page;
      //从localStrorge拿取查询条件
      let manualquery = JSON.parse(localStorage.getItem("manualquery"));
      if (manualquery) this.data.data = manualquery;
      // 存储当前页码，方便重载页面的时候回到当前页
      try {
        localStorage.setItem(
          "manualCurrentPageNum",
          JSON.stringify(newPageNum)
        );
        console.log("尝试存储页码...");
        this.checkStorage("manualCurrentPageNum"); // 检查存储是否成功
      } catch (error) {
        console.error("存储到localStorage失败: ", error);
      }
      //开始执行向后端请求的函数
      this.getUsersList(this.data);
    },
    async getUsersList(query) {
      this.token = Cookies.get("token");
      //1根据查询条件向后端请求
      const res = await manualrepayserachList(query);
      console.log("window.location.host11", this.$route, res);
      //2如果返回结果成功
      if (res.status.code === 0) {
        let { pageNum, pageSize, startIndex, totalRecord } = res.data.page;
        let start = (pageNum - 1) * pageSize + 1;
        let end = Math.min(startIndex + pageSize - 1, totalRecord);
        console.log("this.res.data-Audit-history", res, res.data);
        this.itemList = res.data.data;
        this.loading = false //关闭loading
        this.total = res.data.page.totalRecord; // 模拟总数据量
      }
    },
    gotoManualDetail(row) {
      console.log("row", row);
      // 触发mutation更新Vuex中的selectedItem
      // const encryptedValue = this.encrypt("secretValue", row.loanId);
      this.$router.push({ path: `/manualdetail/${row.loanId}` });
      // 数据存储到vuex: 当条数据
      this.$store.dispatch("userinfo/setCustId", row.custId);
      this.$store.dispatch("userinfo/setOfflineID", row.loanId);
      console.log(
        "newpage-showpass",
        this.$store.state.userinfo.setOfflineID,
        this.$store.state.userinfo.offlineId,
        this.$store.state.userinfo.custId
      );
      // 使用localstorage 进行持久化存储
      this.localstorageData.push(row);
      localStorage.setItem("loanId", JSON.stringify(row.loanId));
      // 进入详情页之前存储当前页码
      localStorage.setItem("manualCurrentPage", this.page.pageNum.toString());
      let rowdata = localStorage.setItem(
        "keydata",
        JSON.stringify(this.localstorageData)
      );
      console.log("row-localstorage", this.localstorageData);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
