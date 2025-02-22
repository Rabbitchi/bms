<template>
  <div class="dashboard-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="phone">
        <el-input
          v-model="formInline.phone"
          prefix-icon="el-icon-search"
          style="width: 180px"
          placeholder="phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="national id">
        <el-input
          v-model="formInline.nationalId"
          prefix-icon="el-icon-search"
          style="width: 180px"
          placeholder="national id"
        ></el-input>
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
      <el-form-item>
        <el-button class="search-button" type="primary" @click="onSearch"
          >Search</el-button
        >
        <el-button class="clear-button" type="primary" @click="clearForm"
          >Clear</el-button
        >
      </el-form-item>
    </el-form>
    <div class="dashboard-info-list" style="height: 720px;">
      <el-descriptions title="Processing Case List">
        <!-- <el-descriptions-item class="tag-group__title" label="用户名">kooriookami</el-descriptions-item> -->
      </el-descriptions>
      <el-table
        v-if="itemList.length > 0"
        v-loading="loading"
        element-loading-text="Loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 0.8)"
        :data="itemList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        style="width: 100%"
      >
        <el-table-column label="index" fixed>
          <template slot-scope="scope">
            {{ (page.pageNum - 1) * page.pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="documentNumber" label="National ID" width="180">
        </el-table-column>
        <el-table-column prop="firstName" label="firstName" width="180">
        </el-table-column>
        <el-table-column prop="lastName" label="lastName" width="180">
        </el-table-column>
        <el-table-column
          prop="gender"
          label="gender"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="education"
          label="education"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="email"
          width="180"
        ></el-table-column>
        <el-table-column prop="phone" label="phone" width="180">
        </el-table-column>
        <el-table-column prop="createTime" label="apply_time" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="operate" width="180">
          <template slot-scope="scope">
            <el-button @click="gotodetail(scope.row)" type="text" size="small"
              >check</el-button
            >
            <!-- <el-button type="text" size="small">编辑</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-table
       
        :data="itemList"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        border
        style="width: 100%"
      > -->
      <el-empty  v-else
         v-loading="loading"
         element-loading-text="Loading"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(255, 255, 255, 0.8)" description="There are no pending cases, please contact your boss"></el-empty>
      <!-- </el-table> -->
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
import { pageLoanApplyInfo } from "../../api/bas/user";
import Cookies from "js-cookie";
import VueRouter from "vue-router";
import DateRangePicker from "@/components/DateRangePicker.vue";

export default {
  name: "processing-case",
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
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  watch: {
    $route: {
      handler(to, from) {
        let queryId = JSON.parse(localStorage.getItem("queryId"));
        if (to.path === "/audit-management") {
          console.log("刷新");
        }
      },
      immediate: true,
    },
    "page.pageNum": {
      handler: function (newVal, oldVal) {
        this.restorePageState();
        this.validatePageNumber();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
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
      const savedPage = localStorage.getItem("procurrentPage");
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
    },
    checkFormValuesAndSetPage() {
      // 检查指定字段是否至少有一个不为空
      const hasValue =
        this.formInline.phone !== "" || this.formInline.nationalId !== "";
      // 根据检查结果设置 pageNum
      if (hasValue) {
        this.page.pageNum = 1;
      } else {
        this.page.pageNum = this.restorePageState();
      }
    },
    onSearch() {
      // 遍历formInline对象的属性，去除前后空格
      Object.keys(this.formInline).forEach((key) => {
        if (typeof this.formInline[key] === "string") {
          this.formInline[key] = this.formInline[key].trim();
        }
      });
      // this.page.pageNum = this.restorePageState()
      this.checkFormValuesAndSetPage();
      if (this.page.pageNum && this.data.page && this.data.page.pageNum > 1) {
        this.page.pageNum = 1;
      }
      this.data.page = this.page;
      this.data.data = this.formInline;
      console.log("onSearch", this.data);
      this.getUsersList(this.data);
      //将搜索条件存储到localStrorge
      const prosearchquery = this.formInline;
      //判断有没有存储成功
      if (prosearchquery) {
        try {
          let key = "prosearchQuery";
          localStorage.setItem(
            "prosearchQuery",
            JSON.stringify(prosearchquery)
          );
          console.log("尝试存储搜索条件...");
          this.checkStorage(key); // 检查存储是否成功
        } catch (error) {
          console.error("存储到localStorage失败: ", error);
        }
      }
    },
    // 用户改变每页显示的条目数时调用
    handleSizeChange(newSize) {
      this.page.pageSize = newSize;
      this.data.page = this.page;
      this.getUsersList(this.data);
    },
    // 用户改变当前页码时调用
    handleCurrentChange(newPage) {
      this.page.pageNum = newPage;
      this.data.page = this.page;
      //从localStrorge拿取查询条件
      let searchQuery = JSON.parse(localStorage.getItem("prosearchQuery"));
      if (searchQuery) this.data.data = searchQuery;
      // 存储当前页码，方便重载页面的时候回到当前页
      try {
        localStorage.setItem("procurrentPageNum", JSON.stringify(newPageNum));
        console.log("尝试存储页码...");
        this.checkStorage("procurrentPageNum"); // 检查存储是否成功
      } catch (error) {
        console.error("存储到localStorage失败: ", error);
      }
      this.getUsersList(this.data);
    },
    async getUsersList(query) {
      this.data.page = this.page;
      this.token = Cookies.get("token");
      console.log("1111", this.page, this.data);
      const res = await pageLoanApplyInfo(query);
      console.log("window.location.host11", this.$route);
      if (res.status.code == 0) {
        // 计算起始索引和结束索引
        let { pageNum, pageSize, startIndex, totalRecord } = res.page;
        let start = (pageNum - 1) * pageSize + 1;
        let end = Math.min(startIndex + pageSize - 1, totalRecord);
        // 接口返回 res.data [], 显示 There are no auditable cases
        this.itemList = res.data;
        // this.itemList = [];
        this.loading = false //关闭loading
        this.total = res.page.totalRecord; // 模拟总数据量
      }
    },
    gotodetail(row) {
      console.log("row", row);
      this.$router.push({ path: `/detail/${row.phone}` });
      // 数据存储到vuex: 当条数据
      this.$store.dispatch("userinfo/setSelectuserInfo", row);
      this.$store.dispatch("userinfo/setShowPass", row.reviewResult);
      // 使用localstorage 进行持久化存储
      this.localstorageData.push(row);
      localStorage.setItem("queryId", JSON.stringify(row.phone));
      // 进入详情页之前存储当前页码
      localStorage.setItem("procurrentPage", this.page.pageNum.toString());
      let rowdata = localStorage.setItem(
        "keydata",
        JSON.stringify(this.localstorageData)
      );
      console.log("row-localstorage", this.localstorageData);
    },
  },
  created() {
    this.validatePageNumber();
  },
  mounted() {
    // this.$router.go(0);
    //程序启动先执行一遍，获取第一页数据
    //1.构建查询参数
    //1.1如果不是第一次加载先尝试从本地拿去查询参数---页码和查询参数
    let savedPage = JSON.parse(localStorage.getItem("procurrentPage"))
      ? JSON.parse(localStorage.getItem("procurrentPage"))
      : JSON.parse(localStorage.getItem("procurrentPageNum"));
    let searchQuery = JSON.parse(localStorage.getItem("prosearchQuery"));
    //渲染的时候,条件框保留上次的参数
    if (searchQuery) this.formInline = searchQuery;
    //1.2如果不是第一次加载从 localStorage 获取页码
    if (savedPage) {
      const hasValue =
        this.formInline.phone !== "" || this.formInline.nationalId !== "";
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
      this.data.data = this.formInline;
    }
    //2.根据查询参数调用查询方法
    this.getUsersList(this.data);
    //3.这里进行强制更新pageNume
    this.$nextTick(() => {
      this.page.pageNum = parseInt(savedPage);
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
