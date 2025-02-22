<!--
	作者：ganshengqu
	时间：2020-09-09
	描述：导出文件弹窗
-->
<template>
  <div class="needFieldsDialog">
    <el-dialog
      title="Need fields"
      :visible.sync="dialogShow"
      width="40%"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <!--需要筛选的字段-->
      <div class="content">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          select all
        </el-checkbox>
        <div style="margin: 10px 0"></div>
        <el-checkbox-group
          v-model="checkedOptions"
          @change="handleCheckedChange"
        >
          <el-checkbox
            v-for="item in selectList"
            :label="item.value"
            :key="item.value"
            :disabled="item.isRequired"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <!--操作按钮-->
      <div style="text-align: right; margin-top: 10px">
        <el-button size="mini" @click="dialogClose">cancel</el-button>
        <el-button size="mini" type="primary" @click.stop="exportComfirm">
          Export
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.needFieldsDialog {
  /deep/ .el-dialog__header {
    padding-bottom: 0;
  }
  /deep/ .el-dialog__body .el-checkbox {
    margin-bottom: 10px;
  }
}
</style>

<script>
export default {
  components: {},
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    //模板头部对应后端的字段
    filterTemplateHeader: {
      type: Array,
      default: function () {
        return []
      }
    },
    //必填项
    needCheckList: {
      type: Array,
      default: function () {
        return []
      }
    },
    //所有的数据
    exportList: {
      type: Array,
      default: function () {
        return []
      }
    },
    //导出模板的文件名
    Filename: {
      type: String,
      default: ''
    },
    //设置弹窗默认值是否是全部导出
    setDialogStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      //默认初始状态不是全部导出，如果开始就是全部导出（例如财务报表FRS模板，就需要修改默认值为true,同时修改isIndeterminate默认值为false）
      checkAll: this.setDialogStatus,
      //checkAll: false,
      checkedOptions: [],
      selectList: this.filterTemplateHeader,
      isIndeterminate: !this.setDialogStatus
      //isIndeterminate: true
    }
  },
  computed: {},
  watch: {},
  mounted() {
    //页面初始化时，先处理必选项数组数组格式
    let dealNeedCheckList = []
    this.needCheckList.map((item) => {
      dealNeedCheckList.push(item.value)
    })
    this.checkedOptions = dealNeedCheckList
  },
  methods: {
    dialogClose() {
      this.$emit('cancelDailog', false)
    },
    exportComfirm() {
      //导出数据
      let _this = this
      import('@/vendor/Export2Excel')
        .then((excel) => {
          const filterVal = _this.checkedOptions
          let dealExportList = []
          //导出数据至少有一条
          if (_this.exportList.length === 0) {
            return
          }
          _this.exportList.map((item) => {
            var newObject = {}
            for (var i = 0; i < filterVal.length; i++) {
              newObject[filterVal[i]] = item[filterVal[i]]
            }
            dealExportList.push(newObject)
          })
          const data = this.formatJson(filterVal, dealExportList)
          //将表头还原成展示的字段值
          let exportHeaderList = []
          filterVal.map((item) => {
            var newArray = []
            for (var j = 0; j < _this.filterTemplateHeader.length; j++) {
              if (_this.filterTemplateHeader[j].value === item) {
                newArray.push(_this.filterTemplateHeader[j].name)
              }
            }
            exportHeaderList = exportHeaderList.concat(newArray)
          })
          //console.log(exportHeaderList)
          excel.export_json_to_excel({
            header: exportHeaderList,
            data,
            filename: _this.Filename
          })
          //导出成功，关闭弹窗
          _this.$emit('cancelDailog', false)
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },
    handleCheckAllChange(val) {
      //v-model开始默认绑定必填项
      //处理数据格式成： ['a','b'..]这种格式
      let _this = this
      let dealFilterTemplateHeader = []
      let dealNeedCheckList = []
      _this.filterTemplateHeader.map((item) => {
        dealFilterTemplateHeader.push(item.value)
      })
      _this.needCheckList.map((item) => {
        dealNeedCheckList.push(item.value)
      })
      if (
        !val &&
        _this.filterTemplateHeader.length == _this.needCheckList.length
      ) {
        //没有必填项的情况
        _this.checkedOptions = []
      } else {
        //有必填项时
        _this.checkedOptions = val
          ? dealFilterTemplateHeader
          : dealNeedCheckList
      }
      _this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.selectList.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.selectList.length
    }
  }
}
</script>
