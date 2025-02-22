<!--
	作者：ganshengqu
	时间：2020-02-04
	描述：
-->
<template>
  <div class="table_container">
    <h3>Offset sequencing management</h3>

    <el-divider></el-divider>

    <div class="table_list">
      <div class="table_list_btns" style="float:left; margin-bottom:20px;">
        <el-button class="btn" type="primary" @click="AddItem">+ Add</el-button>
      </div>
      <!--新增 start-->
      <el-dialog
        title="Add balance component"
        :visible.sync="dialogFormVisible"
        custom-class="dialog_form_wrap"
      >
        <el-form :model="form" label-width="200px" class="clearfix" ref="form">
          <el-form-item
            label="Offset balance component:"
            :rules="[
              { required: true, message: 'please select', trigger: 'change' }
            ]"
            prop="balComptMem"
          >
            <el-select placeholder v-model="form.balComptMem">
              <el-option
                :label="Object.values(item)[0]"
                :value="Object.keys(item)[0]"
                v-for="(item,index) in comptIdTypeList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary"
                     @click="comfirmAdd('form')"
          >Confirm</el-button>
        </div>
      </el-dialog>
      <!--新增 end-->

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
        <el-table-column label="Balance component" width="150" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.balComptMem }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Balance composition type" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.balComptType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Offset sequencing" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.offsetOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="380" align="center">
          <template slot-scope="scope">
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
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  offsetAddDetail,
  offsetDeleteDetail,
  offsetDetails,
  offsetQueryComptIdType
} from "@/api/bfs/offsetManagement";
export default {
  name: "OffsetSequencingMgt",
  components: {},
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      tableData: [],
      form: {
        balComptMem: ""
      },
      comptIdTypeList: []
    };
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  mounted() {
    this.getListItem();
    this.getOffsetQueryComptIdType();
  },
  methods: {
    getOffsetQueryComptIdType() {
      let _this = this;
      let data = {
        data: _this.$route.query.id
      };
      offsetQueryComptIdType(data)
        .then((res) => {
          //处理成数组
          var arr = [];
          let getObj = res.data;
          for (let i in getObj) {
            let o = {};
            o[i] = getObj[i];
            arr.push(o);
          }
          _this.comptIdTypeList = arr;
        })
        .catch((e) => {
          console.log("error");
        });
    },
    AddItem: function () {
      this.form = this.$options.data().form;
      if (this.$refs["form"]) {
        this.$refs["form"].resetFields();
      }
      this.dialogFormVisible = true;
    },
    deleteRow: function (row) {
      let _this = this;
      let data = {
      	"data": {
      	  id: row.id
      	}
      };
      _this
        .$confirm("Confirm deletion of offset sequence?", "Prompt", {
          confirmButtonText: "Confirm",
          cancelButtonText: "Close",
          type: "warning"
        })
        .then(() => {
          offsetDeleteDetail(data)
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
      let data = {
		    "data": {
		        "offsetId": _this.$route.query.id
		    }
		}
      offsetDetails(data)
        .then((res) => {
          _this.listLoading = false;
          if (res.data) {
            _this.setTableData(res);
          }
        })
        .catch((e) => {
          _this.listLoading = false;
        });
    },
    setTableData: async function (data) {
      this.tableData = data.data;
      await this.$nextTick();
      this.$refs.table.bodyWrapper.scrollTop = 0;
    },
    //添加冲销详情配置
    comfirmAdd(formName) {
      let _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            data: {
              balComptId: _this.form.balComptMem,
              offsetId: Number(_this.$route.query.id)
            }
          };
          offsetAddDetail(data)
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
    }
  }
};
</script>

<style scoped lang="scss">
</style>