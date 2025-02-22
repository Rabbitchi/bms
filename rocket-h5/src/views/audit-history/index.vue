<template>
  <div class="newpage-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="phone">
        <el-input
          v-model="formInline.phone"
          style="width: 180px"
          placeholder="phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="national id">
        <el-input
          v-model="formInline.nationalId"
          style="width: 180px"
          placeholder="national id"
        ></el-input>
      </el-form-item>
      <el-form-item label="reviewerName">
        <el-input
          v-model="formInline.reviewerName"
          style="width: 180px"
          placeholder="reviewerName"
        ></el-input>
      </el-form-item>
      <el-form-item label="reviewResult">
        <el-select
          v-model="formInline.reviewResult"
          placeholder="reviewResult"
          style="width: 180px"
        >
          <el-option label="pass" value="E"></el-option>
          <el-option label="Not passed" value="R"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="ApplyTime">
        <el-col>
          <div class="date-range-pickers">
            <date-range-picker
              v-model="formInline.minApplyTime"
              :placeholder="'minApplyTime'"
            ></date-range-picker>
            ~
            <date-range-picker
              v-model="formInline.maxApplyTime"
              :placeholder="'maxApplyTime'"
            ></date-range-picker>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item label="ReviewTime">
        <el-col>
          <div class="date-range-pickers">
            <date-range-picker
              v-model="formInline.minReviewTime"
              :placeholder="'minReviewTime'"
            ></date-range-picker>
            ~
            <date-range-picker
              v-model="formInline.maxReviewTime"
              :placeholder="'maxReviewTime'"
            ></date-range-picker>
          </div>
        </el-col>
      </el-form-item>
      <el-form-item class="search-button">
        <el-button class="search-button-one" type="primary" @click="onSearch">
          Search
        </el-button>
        <el-button class="clear-button" type="primary" @click="clearForm">
          Clear
        </el-button>
      </el-form-item>
    </el-form>
    <div class="newpage-info-list"  style="height: 853px">
      <el-descriptions title="Audit-history-List"></el-descriptions>
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
          prop="documentNumber"
          label="National ID"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="firstName"
          label="firstName"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="lastName"
          label="lastName"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="gender"
          label="gender"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="maritalStatus"
          label="maritalStatus"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="phone"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="apply_time"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="reviewerName"
          label="ReviewerName"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="reviewResult"
          label="ReviewResult"
          width="120"
        ></el-table-column>
        <el-table-column
          prop="rejectReasonMessage"
          label="rejectReason"
          width="120"
        >
          <template slot-scope="scope">
            <div class="ellipsis-text">{{ scope.row.rejectReasonMessage }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="reviewTime"
          label="Review time"
          width="200"
        ></el-table-column>
        <el-table-column fixed="right" label="Details" width="120">
          <template slot-scope="scope">
            <el-button @click="gotodetail(scope.row)" type="text" size="small">
              check
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
import { pageLoanApplyReviewHistory } from "../../api/bas/user";
import Cookies from "js-cookie";
import DateRangePicker from "@/components/DateRangePicker.vue";
import VueRouter from "vue-router";

export default {
  name: "AuditHistory",
  components: {
    DateRangePicker,
  },
  data() {
    return {
      loading: true,
      formInline: {
        phone: "",
        nationalId: "",
        minApplyTime: "",
        maxApplyTime: "",
        minReviewTime: "",
        maxReviewTime: "",
        reviewerName: "",
        reviewResult: "",
        // 拒绝或退回原因
        rejectReason: "",
      },
      rejectReasonMap: {
        "Clearly, the ID photo and selfie are not the same person":
          "REJECT: Clearly, the ID photo and selfie are not the same person",
        "ID photos or selfies are clearly taken facing a computer screen":
          "REJECT: ID photos or selfies are clearly taken facing a computer screen",
        "Your photo is blurry, please retake a clear one,or It’s too dark to see your photo, please retake it in bright light":
          "RETURN:Your photo is blurry, please retake a clear one,or It’s too dark to see your photo, please retake it in bright light",
        "ID photos or selfies are clearly taken facing a computer screen":
          "REJUCT: ID photos or selfies are clearly taken facing a computer screen",
        "The type of your ID photo is wrong, please provide the ID photo of your national card":
          "RETURN: The type of your ID photo is wrong, please provide the ID photo of your national card",
        "The type of your ID photo is wrong, please provide the ID photo of your national card":
          "RETURN: The type of your ID photo is wrong, please provide the ID photo of your national card",
        "The photo uploaded by the customer misses the ID card photo":
          "RETURN: The photo uploaded by the customer misses the ID card photo",
        "The photo uploaded by the customer misses the selfie":
          "The photo uploaded by the customer misses the selfie",
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
      // searchquery: {}
    };
  },
  computed: {
    ...mapGetters(["name"]),
    rowIndex() {
      if (this.page && typeof this.page.pageNum === 'number' &&    typeof this.page.pageSize === 'number') {
        return (this.page.pageNum - 1) * this.page.pageSize;
      } else {
        console.error('Page data is invalid:', this.page);
        return 1 // 提供一个默认值
      }
    }
  },
  created() {
    this.validatePageNumber()
  },
  mounted() {
    console.log('Initializing formInline:', this.formInline);
    console.log('init', this.page, this.page.pageNum)
    if (isNaN(this.page.pageNum)) {
      console.error('pageNum is not a number, resetting to default');
      this.page.pageNum = 1 // 设置一个默认值以防万一
    }
    // this.data.data = this.formInline
    //1.构建查询参数
    //1.1如果不是第一次加载先尝试从本地拿去查询参数---页码和查询参数
    let savedPage = JSON.parse(localStorage.getItem('currentPage'))
      ? JSON.parse(localStorage.getItem('currentPage'))
      : JSON.parse(localStorage.getItem('currentPageNum'))
    // let savedPage = JSON.parse(localStorage.getItem("currentPageNum"));
    let searchQuery = JSON.parse(localStorage.getItem("searchQuery"));
    //渲染的时候,条件框保留上次的参数
    if (searchQuery) this.formInline = searchQuery;
    //1.2如果不是第一次加载从 localStorage 获取页码
    if (savedPage) {
      const hasValue =
        this.formInline.phone !== '' || this.formInline.nationalId !== ''
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
    if (searchQuery) {
      this.data.data = searchQuery;
    } else {
      console.log('init-init-data', this.formInline)

      this.data.data = this.formInline
    }
    //2.根据查询参数调用查询方法
    console.log('init-init', this.data, this.formInline)
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
          JSON.parse(localStorage.getItem("queryId"))
        );
        let queryId = JSON.parse(localStorage.getItem("queryId"));
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
    validatePageNumber() {
      if (isNaN(this.page.pageNum)) {
        console.error('Page number is NaN, resetting to default');
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
      const savedPage = localStorage.getItem("currentPage");
      console.log("restorePageState", savedPage, parseInt(savedPage, 10));
      // 如果存在保存的页码，则将其转换为整数并返回
      // 如果不存在，返回默认页码，比如 1
      return savedPage ? parseInt(savedPage, 10) : 1;
    },
    clearForm() {
      this.formInline.phone = "";
      this.formInline.nationalId = "";
      this.formInline.minApplyTime = "";
      this.formInline.maxApplyTime = "";
      this.formInline.minReviewTime = "";
      this.formInline.maxReviewTime = "";
      this.formInline.reviewerName = "";
      this.formInline.reviewResult = "";
    },
    checkFormValuesAndSetPage() {
      // 检查指定字段是否至少有一个不为空
      const hasValue = this.formInline.phone !== "" || 
      this.formInline.nationalId !== "" 
      // 根据检查结果设置 pageNum
     if (hasValue) {
        this.page.pageNum = 1;
      } else {
        this.page.pageNum = this.restorePageState();
     }
    },
    onSearch() {
      if (this.formInline && typeof this.formInline === 'object') {
        Object.keys(this.formInline).forEach((key) => {
          if (typeof this.formInline[key] === 'string') {
            this.formInline[key] = this.formInline[key].trim()
          }
        })
      } else {
        console.error(
          'formInline is not initialized properly:',
          this.formInline
        )
      }
      //1.查询参数为页码为默认值，，条件为入参
      this.checkFormValuesAndSetPage();
      // this.page.pageNum = this.restorePageState()
      if (this.page.pageNum && this.data.page && this.data.page.pageNum > 1) {
        this.page.pageNum = 1
      }
      console.log('this.page', this.page);
      this.data.page = this.page;
      this.data.data = this.formInline;
      this.getUsersList(this.data);

      //将搜索条件存储到localStrorge
      const searchquery = this.formInline;
      //判断有没有存储成功
      if (searchquery) {
        try {
          let key = "searchQuery";
          localStorage.setItem("searchQuery", JSON.stringify(searchquery));
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
      let searchQuery = JSON.parse(localStorage.getItem("searchQuery"));
      this.data.data = searchQuery;
      //2调用查询函数
      this.getUsersList(this.data);
    },
    // 用户改变当前页码时调用
    handleCurrentChange(newPageNum) {
      //构造查询参数--包括页码--查询条件
      this.page.pageNum = newPageNum;
      this.data.page = this.page;
      //从localStrorge拿取查询条件
      let searchQuery = JSON.parse(localStorage.getItem("searchQuery"));
      if (searchQuery) this.data.data = searchQuery;
      // 存储当前页码，方便重载页面的时候回到当前页
      try {
        localStorage.setItem("currentPageNum", JSON.stringify(newPageNum));
        console.log("尝试存储页码...");
        this.checkStorage("currentPageNum"); // 检查存储是否成功
      } catch (error) {
        console.error("存储到localStorage失败: ", error);
      }
      //开始执行向后端请求的函数
      this.getUsersList(this.data);
    },
    async getUsersList(query) {
      this.token = Cookies.get("token");
      //1根据查询条件向后端请求
      const res = await pageLoanApplyReviewHistory(query);
      console.log("window.location.host11", this.$route);
      //2如果返回结果成功
      if (res.status.code === 0) {
        let { pageNum, pageSize, startIndex, totalRecord } = res.page;
        let start = (pageNum - 1) * pageSize + 1;
        let end = Math.min(startIndex + pageSize - 1, totalRecord);
        console.log("this.res.data-Audit-history", res.data);
        this.itemList = res.data
          .map((item) => {
            let message = item.rejectReason;
            if (
              item.rejectReason !== null &&
              this.rejectReasonMap.hasOwnProperty(item.rejectReason)
            ) {
              message = this.rejectReasonMap[item.rejectReason];
            }
            return {
              ...item,
              rejectReasonMessage: message, // 添加一个新属性来保存映射后的消息
            };
          })
          .sort((a, b) => {
            // 将时间字符串转换为日期对象进行比较
            return new Date(b.reviewTime) - new Date(a.reviewTime);
          });
        this.loading = false //关闭loading
        this.total = res.page.totalRecord; // 模拟总数据量
      }
    },
    gotodetail(row) {
      console.log("row", row);
      // 触发mutation更新Vuex中的selectedItem
      this.$router.push({ path: `/detail/${row.phone}` });
      // 数据存储到vuex: 当条数据
      this.$store.dispatch("userinfo/setSelectuserInfo", row);
      this.$store.dispatch("userinfo/setShowPass", row.reviewResult);
      console.log(
        "newpage-showpass",
        this.$store.state.userinfo.setSelectuserInfo,
        this.$store.state.userinfo.showpass
      );
      // 使用localstorage 进行持久化存储
      this.localstorageData.push(row);
      localStorage.setItem("queryId", JSON.stringify(row.phone));
      // 进入详情页之前存储当前页码
      localStorage.setItem("currentPage", this.page.pageNum.toString());
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
@import './style.scss';
</style>
