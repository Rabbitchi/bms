<!--
	作者：ganshengqu
	时间：2020-07-24
	描述：Penalty interest table菜单页面
-->
<template>
  <div class="table_container">
    <h3>Penalty interest table</h3>
    <div class="table_filter clearfix">
      <el-form :inline="true" :model="queryConditions.data" ref="rateTable">
        <el-row>
          <el-col :span="24">
            <el-form-item label="No.of penalty interest:" prop="overdueId">
              <el-input v-model="queryConditions.data.overdueId" />
            </el-form-item>
            <el-form-item label="Penalty interest name:" prop="name">
              <el-input v-model="queryConditions.data.name" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn_wrapper" label-width="0">
        <el-button class="btn" type="primary" icon="el-icon-plus" @click="AddItem">Add</el-button>
        <el-button class="btn" icon="el-icon-refresh-right" @click="refreshTable">Update</el-button>
        <el-button
          class="btn btn-default fr"
          icon="el-icon-refresh"
          @click="resetForm('rateTable')"
        >Reset</el-button>
        <el-button class="btn fr" type="primary" icon="el-icon-search" @click="tableSearch">Query</el-button>
      </div>
    </div>
    <el-divider></el-divider>

    <div class="table_list">
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="No.of penalty interest" width="200" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.overdueId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Modify time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="250" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
            >Delete</el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyRow(scope.row)"
            >Modify</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        @pagination="getListItem()"
      />
    </div>
    <!--新增、修改弹窗 start-->
    <el-dialog
      :title="dialogType=='add'?'Add penalty interest':'Modify penalty interest'"
      :visible.sync="dialogFormVisible"
      :before-close="dialogClose"
      class="addTableDialog"
    >
      <el-form :model="form" :rules="rules" :inline="true" class="clearfix" ref="formDom">
        <el-form-item label="No.of penalty interest:">
          <el-input v-model="form.overdueId" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="Penalty interest name:" prop="name">
          <el-input v-model="form.name" autocomplete="off" :disabled="dialogType=='add'?false:true"></el-input>
        </el-form-item>
        <div class="stagedPenalty">
          <h4>Staged penalty interest:</h4>
          <el-button
            class="addBtn"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="addFormItem"
          >Add</el-button>
          <template v-if="form.overdueList.length">
            <div class="formListItem">
              <el-form-item>Maximal days of sublevel</el-form-item>
              <el-form-item>Interest rate Id</el-form-item>
              <el-form-item>Operation</el-form-item>
            </div>
            <div v-for="(item, index) in form.overdueList" :key="index" class="formListItem">
              <el-form-item
                :prop="'overdueList.' + index + '.days'"
                :rules="{required: true, message: 'Cannot be empty', trigger: 'blur'}"
              >
                <el-input v-model="item.days" type="number"></el-input>
              </el-form-item>
              <el-form-item
                :prop="'overdueList.' + index + '.interestRateId'"
                :rules="{required: true, message: 'Cannot be empty', trigger: 'change'}"
              >
                <el-select v-model="item.interestRateId" placeholder>
                  <el-option
                    :label="itemRate.name"
                    :value="itemRate.interestRateId"
                    v-for="(itemRate,IdIndex) in InterestRateIdList"
                    :key="IdIndex"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click.prevent="removeFormItem(item)">Delete</el-button>
              </el-form-item>
            </div>
          </template>
          <!--overdueList是null时显示-->
          <template v-else>
            <div class="formListItem">
              <el-form-item>Maximal days of sublevel</el-form-item>
              <el-form-item>Interest rate Id</el-form-item>
              <el-form-item>Operation</el-form-item>
            </div>
          </template>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" style="margin-top: 15px;">
        <el-button
          type="primary"
          @click="dialogType==='add'?confirmAdd('formDom'):confirmMdf('formDom')"
        >Confirm</el-button>
        <el-button class="cancle" @click="cancleDialog">Cancel</el-button>
      </div>
    </el-dialog>
    <!--新增、修改弹窗 end -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import {
  overdueAdd,
  overdueDelete,
  overdueModify,
  overdueQueryAllList,
  queryDetailListByOverdueId,
  productOverdueQueryAllList,
  overdueDetails
} from "@/api/bfs/penaltyInterest";
import { queryInterestList } from "@/api/bfs/interestAndPenalty";

export default {
  name: "BfsPenaltyInterestTable",
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
      	"data": {
           "overdueId": null,
           "name": ""
		 },
	    "page": {
	      "pageNum": 1,
	      "pageSize": 10
	    }
      },
      //表单校验规则
      rules: {
        name: [
          { required: true, message: "please enter", trigger: "blur" },
          { min: 1, message: "Can not be empty", trigger: "blur" }
        ],
        overdueId: [
          { required: true, message: "please enter", trigger: "blur" },
          { min: 1, message: "Can not be empty", trigger: "blur" }
        ]
      },
      "form": {
	        "name": "",
	        "overdueId": null,
	        "overdueList": []
	   },
      //Interest rate Id
      InterestRateIdList: [],
      //罚息的详细
      OverdueIdDetailsList: [],
      //判断弹窗是新增，还是修改
      dialogType: "add"
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  mounted() {
    this.getListItem();
    this.getQueryInterestList();
  },
  methods: {
  	dialogClose() {
      this.dialogFormVisible = false;
      if (this.$refs["formDom"]) {
        this.$refs["formDom"].resetFields();
      }
    },
  	//获取罚息的详细列表
  	getQueryInterestList(){
  	  let _this = this
  	  queryInterestList()
        .then((res) => {
          _this.InterestRateIdList = res.data
        })
        .catch((e) => {
          console.log("error");
        });
  	},
    AddItem: function () {
      this.dialogType = "add";
      this.form = this.$options.data().form;
      if (this.$refs["formDom"]) {
        this.$refs["formDom"].resetFields();
      }
      this.dialogFormVisible = true;
    },
    modifyRow: function (row) {
      let _this = this;
      let newData = JSON.parse(JSON.stringify(row));
      _this.form.name = newData.name;
      _this.form.overdueId = newData.overdueId;
      //调用接口查询overdueList
      let reqData = {
		    "data": {
			 "overdueId": newData.overdueId
			}
		  }
	      overdueDetails(reqData)
	            .then((res) => {
	            	_this.form.overdueList = res.data;
	                _this.dialogType = "modify";
                    _this.dialogFormVisible = true;
	            })
	            .catch((e) => {
	              console.log("error");
	            });
    },
    deleteRow: function (row) {
      let _this = this;
      let data = {
		    "data": {
		        "overdueId": row.overdueId
		    }
		}
      _this
        .$confirm(
          "Confirm deletion of penalty interest information",
          "System prompt",
          {
            confirmButtonText: "Comfirm",
            cancelButtonText: "Close",
            type: "warning"
          }
        )
        .then(() => {
          overdueDelete(data)
            .then((res) => {
              _this.$message({
                type: "success",
                message: "successfully deleted!"
              });
              //删除成功，刷新当前列表
              _this.getListItem();
            })
            .catch((e) => {
              console.log("error");
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "Canceled"
          });
        });
    },
    getListItem: function () {
      let _this = this;
      _this.listLoading = true;
      // 分页逻辑
      overdueQueryAllList(_this.queryConditions)
        .then((res) => {
          _this.listLoading = false;
          if (res.data) {
            _this.setTableData(res);
          } else {
          	_this.tableData = [];
            _this.total = 0;
          }
        })
        .catch((e) => {
          _this.listLoading = false;
        });
    },
    setTableData: async function (data) {
      this.tableData = data.data;
      this.total = data.page.totalRecord;
      await this.$nextTick();
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },
    resetForm: function (tableRef) {
      this.$refs[tableRef].resetFields();
      this.getListItem();
    },
    //搜索
    tableSearch() {
      this.queryConditions.page.pageNum = 1;
      this.getListItem();
    },
    addFormItem() {
      this.form.overdueList.push({
        days: "",
        interestRateId: ""
      });
    },
    removeFormItem(item) {
      var index = this.form.overdueList.indexOf(item);
      if (index !== -1) {
        this.form.overdueList.splice(index, 1);
      }
    },
    //确认添加
    confirmAdd(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          delete _this.form.overdueId;
	      let data = {
	        data: _this.form
	      };
	      overdueAdd(data)
	        .then((res) => {
	          _this.dialogFormVisible = false;
	          _this.queryConditions.page.pageNum = 1;
	          _this.getListItem();
	        })
	        .catch((e) => {
	          _this.dialogFormVisible = false;
	        });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //关闭弹窗
    cancleDialog() {
      this.dialogFormVisible = false;
    },
    //刷新表格
    refreshTable() {
      this.queryConditions.page.pageNum = 1;
      this.getListItem();
    },
    //确认修改
    confirmMdf(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            data: _this.form
          };
          overdueModify(data)
            .then((res) => {
              _this.dialogFormVisible = false;
              _this.getListItem();
            })
            .catch((e) => {
              _this.dialogFormVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-table .btn-mdf {
  background-color: #23c6c8;
  border-color: #23c6c8;
  color: #ffffff;
}
.table_filter .btn_wrapper {
  margin-bottom: 0;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .el-dialog__footer {
  position: relative;
  right: 0;
}
/deep/ .el-dialog {
  border-radius: 5px;
}
.addItem {
  display: inline-block;
  width: 50%;
  /deep/ .el-form-item__label {
    width: 170px;
  }
  /deep/ .el-form-item__content {
    margin-left: 170px;
    .el-input {
      width: 100%;
    }
  }
}
.stagedPenalty {
  margin: 10px 0;
  display: table;
  border-collapse: collapse;
  width: 100%;
  padding: 10px 0;
  border-spacing: 5px 1px;
  h4 {
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
    display: block;
  }
  .addBtn {
    margin-bottom: 10px;
  }
  .formListItem {
    display: table-row;
    line-height: 40px;
    div {
      display: table-cell;
      &.el-form-item {
        border: 1px solid #ccc;
        /deep/ .el-input__inner {
          margin: 0;
          height: 34px;
        }
        /deep/ .el-form-item__content {
          padding-left: 10px;
          button {
            border: none;
            margin-left: -10px;
          }
        }
      }
    }
  }
}
</style>