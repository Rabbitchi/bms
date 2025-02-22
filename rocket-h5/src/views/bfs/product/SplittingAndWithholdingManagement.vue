<!--
	作者：ganshengqu
	时间：2020-02-13
	描述：
-->
<template>
  <div class="table_container">
    <h3>Splitting and withholding management</h3>
    <el-divider></el-divider>

    <div class="table_list">
      <div class="table_list_btns" style="float:left; margin-bottom:20px;">
        <el-button class="btn" icon="el-icon-plus" type="primary" @click="AddItem">Add</el-button>
        <el-button class="btn" icon="el-icon-refresh-right" @click="refreshTable">Update</el-button>
      </div>
      <!--表格  start-->
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="tableData"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="ID" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Remark" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Split type" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.splitOrderType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Min repayment amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.minRepayAmt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Min cpdbeginday" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.minCpdbeginDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Max cpdbeginday" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.maxCpdbeginDay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="450" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="modifyRow(scope.row)"
            >Modify</el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-search"
              @click="checkDetails(scope.row)"
            >Order split configuration</el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格  end-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryConditions.page.pageNum"
        :limit.sync="queryConditions.page.pageSize"
        @pagination="getListItem()"
      />
    </div>
    <!--新增 start-->
    <el-dialog
      :title="dialogType=='add'?'Add order split config':'Update order split config'"
      :visible.sync="dialogFormVisible"
      :before-close="dialogClose"
      custom-class="dialog_form_wrap"
      width="60%"
    >
      <el-form :model="form" :rules="rules" ref="form" class="clearfix" label-width="160px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="ID:" prop="id">
              <el-input v-model="form.id" autocomplete="off" :disabled="dialogType !== 'add'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Remark:" prop="remark">
              <el-input v-model="form.remark" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Split type:" prop="splitOrderType">
              <el-select v-model="form.splitOrderType" placeholder>
                <el-option label="按固定金额" value="A"></el-option>
                <el-option label="按比例计算" value="R"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Min repayment amount:" prop="minRepayAmt">
              <el-input v-model="form.minRepayAmt" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Min cpdbeginday:" prop="minCpdbeginDay">
              <el-input v-model="form.minCpdbeginDay" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Max cpdbeginday:" prop="maxCpdbeginDay">
              <el-input v-model="form.maxCpdbeginDay" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogType==='add'?comfirmAdd('form'):comfirmMdf('form')"
        >Confirm</el-button>
        <el-button class="cancle" @click="dialogFormVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
    <!--新增 end-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Pagination from "@/components/Pagination";
import {
  orderSplitPageList,
  orderSplitAdd,
  orderSplitModify,
  orderSplitDelete
} from "@/api/bfs/splittingAndWithholdingManagement";
export default {
  name: "BfsSplittingAndWithholdingManagement",
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      queryConditions: {
	    "data": {},
	    "page": {
	        "pageNum": 1,
	        "pageSize": 10
	    }
	  },
      form: {
      	"id": "",
        "remark": "",
        "splitOrderType": "",
        "minRepayAmt": null,
        "minCpdbeginDay": "",
        "maxCpdbeginDay": null
      },
      rules: {
        splitOrderType: [
          { required: true, message: "please select", trigger: "change" }
        ],
        maxCpdbeginDay: [
          { required: true, message: "please enter", trigger: "blur" }
        ],
        minCpdbeginDay: [
          { required: true, message: "please enter", trigger: "blur" }
        ],
        minRepayAmt: [{ required: true, message: "please enter", trigger: "blur" }],
        remark: [
          { required: false, message: "please enter", trigger: "blur" },
          { min: 0, message: "Can not be empty", trigger: "blur" }
        ],
        id: [
          { required: false, message: "please enter", trigger: "blur" },
          { min: 0, message: "Can not be empty", trigger: "blur" }
        ]
      },
      //判断弹窗是新增，还是修改
      dialogType: "add"
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  mounted() {
    this.getListItem();
  },
  methods: {
  	dialogClose() {
      this.dialogFormVisible = false;
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
    },
    AddItem: function () {
      this.dialogType = "add";
      this.form = this.$options.data().form;
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogFormVisible = true;
    },
    modifyRow: function (row) {
      let newData = JSON.parse(JSON.stringify(row));
      delete newData.createTime;
      delete newData.createUser;
      delete newData.updateTime;
      delete newData.updateUser;
      this.form = newData;
      this.dialogType = "modify";
      this.dialogFormVisible = true;
    },
    deleteRow: function (row) {
      let _this = this;
      let data = {
		    "data": {
		        "id": row.id
		    }
		}
      _this
        .$confirm(
          "Confirm deletion of this product?",
          "System prompt",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Close",
            type: "warning"
          }
        )
        .then(() => {
          orderSplitDelete(data)
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
      orderSplitPageList(_this.queryConditions)
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
    //添加冲销配置
    comfirmAdd(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            data: _this.form
          };
          orderSplitAdd(data)
            .then((res) => {
              _this.dialogFormVisible = false;
              //添加成功，刷新列表
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
    //刷新
    refreshTable() {
      this.getListItem();
    },
    //修改
    comfirmMdf(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            data: _this.form
          };
          orderSplitModify(data)
            .then((res) => {
              _this.dialogFormVisible = false;
              //添加成功，刷新列表
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
    //查看详情
    checkDetails(row) {
      this.$router.push({
        path: "/operationMgt/OrderSplitConfigDetail",
        query: { id: row.id }
      });
    }
  }
};
</script>

<style scoped lang="scss">
</style>
