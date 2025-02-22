<!--
	作者：ganshengqu
	时间：2020-06-04
	描述：邮件管理.查看弹窗
-->
<!--eslint-disable-->
<template>
  <div class="check-dialog">
    <el-dialog
      title="查看"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <el-form label-width="100px">
        <el-form-item label="邮件标题">
          <el-input v-model="checkObj.emailTitle" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮件内容">
          <div v-html="checkObj.emailContent" class="email_content"></div>
        </el-form-item>
        <el-form-item label="所属业务">
          <el-select v-model="checkObj.businessLine" disabled></el-select>
        </el-form-item>
        <el-form-item label="发件人邮箱">
          <el-col :span="11">
            <el-select v-model="checkObj.senderEmail" disabled></el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="发送类型">
          <el-radio-group v-model="checkObj.startType" size="medium" disabled>
            <el-radio border label="INSTANT">即时发送</el-radio>
            <el-radio border label="TIMING">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户群体">
          <el-radio-group size="medium" disabled>
            <el-radio border>导入名单</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.check-dialog {
  width: 100%;
  /deep/ .el-dialog__header {
    text-align: center;
    padding-bottom: 0;
  }
  /deep/ .el-dialog {
    border-radius: 5px;
  }
  /deep/ .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
  /deep/ .el-tabs__item {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding-top: 25px;
  }
  /deep/ .dialog_bottom {
    width: 100%;
    float: left;
  }
  .show_img {
    img {
      width: 100px;
      height: auto;
    }
  }
  .email_content {
    width: 100%;
    overflow-x: hidden;
    border-radius: 4px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 5px 15px 5px 15px;
    /deep/ p {
      margin-bottom: 10px;
      img {
        width: 250px;
        height: auto;
      }
    }
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
    checkObj: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    dialogClose() {
      this.$emit('cancelDailog', false)
    }
  }
}
</script>
