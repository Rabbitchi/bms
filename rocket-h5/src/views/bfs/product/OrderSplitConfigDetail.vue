<!--
	作者：ganshengqu
	时间：2020-02-14
	描述：
-->
<template>
  <div class="table_container">
    <h3>Order split config detail</h3>

    <el-divider></el-divider>

    <!--返显详情信息 start-->
    <div class="basic_details clearfix">
      <el-form :model="detailsForm" label-width="40%" class="clearfix">
        <el-form-item label="*ID:">
          <el-input v-model="detailsForm.id" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="Remark:">
          <el-input v-model="detailsForm.remark" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="*Split type:">
          <el-input v-model="detailsForm.splitOrderType" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="*Min repayment amount:">
          <el-input v-model="detailsForm.minRepayAmt" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="*Min cpdbeginday:">
          <el-input v-model="detailsForm.minCpdbeginDay" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="*Max cpdbeginday:">
          <el-input v-model="detailsForm.maxCpdbeginDay" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!--返显详情信息 end-->

    <div class="table_list">
      <h3 style="margin-top: 20px;">Order split config detail base info</h3>

      <el-divider></el-divider>

      <div class="table_list_btns" style="float:left; margin-bottom:20px;">
        <el-button class="btn" type="primary" @click="AddItem">+ Add</el-button>
      </div>
      <!--新增 /修改弹窗start-->
      <el-dialog :title="dialogType=='add'?'Add order split detail':'modify order split detail'" :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="30%" class="clearfix" ref="form">
          <el-form-item label="ID:">
            <el-input v-model="form.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="Amt/Rate:"
            prop="splitRateAmt"
          >
            <el-input v-model="form.splitRateAmt" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogType==='add'?comfirmAdd('form'):mdfConfirm('form')">Confirm</el-button>
        </div>
      </el-dialog>
      <!--新增 /修改弹窗 end-->

      <!--表格  start-->
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="detailsForm.detailConfigList"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="ID" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Amt/Rate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.splitRateAmt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Creation time" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="380" align="center">
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
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--表格  end-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  orderSplitDetail,
  orderSplitSaveDetail,
  orderSplitModifyDetail,
  orderSplitDeleteDetail
} from "@/api/bfs/splittingAndWithholdingManagement";
export default {
  name: "OffsetSequencingMgt",
  components: {},
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      tableData: [],
      form: {
      	"id": "",
        "splitConfigId": "",
        "splitRateAmt": 0
      },
      detailsForm: {
      	"id": "",
        "remark": "",
        "splitOrderType": "",
        "minRepayAmt": 200.22,
        "minCpdbeginDay": "3",
        "maxCpdbeginDay": 30,
        "detailConfigList": []
      },
      //判断弹窗是新增，还是修改
      dialogType: "add"
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  mounted() {
    this.checkDeatils();
  },
  methods: {
    checkDeatils() {
      let _this = this;
      let data = {
	    "data": {
	        "id": _this.$route.query.id
	    }
	  }
      orderSplitDetail(data)
        .then((res) => {
          _this.detailsForm = res.data;
        })
        .catch((e) => {
          console.log("error");
        });
    },
    AddItem: function () {
      this.dialogType = "add";
      this.form = this.$options.data().form;
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogFormVisible = true;
    },
    deleteRow: function (row) {
      let _this = this;
      console.log(row);
      let data = {
		    "data": {
		        "id": row.id
		    }
		}
      _this
        .$confirm("Confirm deletion of this product?", "System prompt", {
          confirmButtonText: "Comfirm",
          cancelButtonText: "Close",
          type: "warning"
        })
        .then(() => {
          orderSplitDeleteDetail(data)
            .then((res) => {
              _this.$message({
                type: "success",
                message: "successfully deleted!"
              });
              _this.checkDeatils();
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
    //添加冲销详情配置
    comfirmAdd(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
          	"data": {
          	  "id": _this.form.id,
              "splitConfigId": _this.$route.query.id,
              "splitRateAmt": _this.form.splitRateAmt
          	}
		  }
          orderSplitSaveDetail(data)
            .then((res) => {
              _this.dialogFormVisible = false;
              //添加成功，刷新列表
              _this.checkDeatils();
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
    modifyRow(row) {
      let newData = JSON.parse(JSON.stringify(row));
      this.form = newData;
      this.dialogType = "modify";
      this.dialogFormVisible = true;
    },
    //修改拆分代扣详细配置
    mdfConfirm(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
		    "data": _this.form
		  }
          orderSplitModifyDetail(data)
            .then((res) => {
              _this.dialogFormVisible = false;
              _this.checkDeatils();
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
.basic_details {
  width: 100%;
  min-height: 200px;
}
.basic_details /deep/ .el-form-item {
  width: 50% !important;
  float: left;
}
/deep/ .el-table .cell {
  word-break: break-word;
}
/deep/ .el-table th {
  padding: 10px 0;
}
/deep/ .el-table th.is-leaf {
  font-weight: 600;
}

.el-input,
.el-select {
  width: 300px;
}
/deep/ .el-dialog__body {
  padding-bottom: 0;
}
/deep/ .el-dialog__footer {
  position: relative;
  right: 0;
}
.table_container {
  background: #ffffff;
  padding: 40px 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  .queryForm {
    margin-top: 50px;
    text-align: left;
    .el-form-item__label {
      text-indent: 20px;
    }
    .el-form-item {
      width: 28%;
      margin-right: 3.3%;
      // /deep/ .el-input__inner {
      //   width: 200px;
      // }
      &.btn_wrapper {
        margin-right: 0;
        text-align: left;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 100%;
      }
      .el-button--mini {
        padding: 7px 7px;
      }
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>