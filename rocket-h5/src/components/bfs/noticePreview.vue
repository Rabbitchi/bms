<!--
	作者：ganshengqu
	时间：2020-05-26
	描述：编辑创建弹窗
-->
<template>
  <div class="preview-dialog">
    <el-dialog
      title="系统公告预览"
      :visible.sync="previewDialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <el-form ref="systemForm" :model="previewObj" label-width="100px">
        <el-form-item label="标题" :required="true">
          <el-input
            v-model="previewObj.pushTitle"
            maxlength="50"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="Push内容" :required="true">
          <div class="previewPushContent">{{ previewObj.pushContent }}</div>
        </el-form-item>
        <el-form-item label="所属业务" :required="true">
          <el-select
            v-model="previewObj.lineOfBusiness"
            placeholder="请选择"
            disabled
          ></el-select>
        </el-form-item>
        <el-form-item label="署名" :required="true">
          <el-input
            v-model="previewObj.signature"
            maxlength="30"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="公告内容" :required="true">
          <div
            class="preview-notice-content"
            v-html="previewObj.noticeContent"
          ></div>
        </el-form-item>
        <el-form-item label="发送类型" :required="true">
          <el-radio-group v-model="previewObj.startType" size="medium" disabled>
            <el-radio border label="INSTANT">即时发送</el-radio>
            <el-radio border label="TIMING">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="定时发送"
          v-if="previewObj.startType == 'TIMING'"
          :required="true"
        >
          <el-date-picker
            v-model="previewObj.startTime"
            type="datetime"
            disabled
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="用户群体" :required="true">
          <el-radio-group v-model="previewObj.userGroup" size="medium" disabled>
            <el-radio border label="filted">筛选用户</el-radio>
            <el-radio border label="specified">导入名单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label v-if="previewObj.userGroup == 'filted'">
          <el-button type="primary">请筛选</el-button>
        </el-form-item>
        <el-form-item label v-if="previewObj.userGroup == 'specified'">
          <p>{{ fileName }}</p>
        </el-form-item>
        <el-form-item size="large">
          <el-button @click="dialogClose" class="closeBtn">关闭</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.preview-dialog {
  .preview-notice-content {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    line-height: 40px;
    padding: 15px;
    min-height: 40px;
    background-color: #f5f7fa;
    overflow-x: hidden;
    /deep/ img {
      width: 200px;
      height: auto;
    }
  }
  .previewPushContent {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    line-height: 40px;
    padding: 5px 15px;
    min-height: 40px;
    background-color: #f5f7fa;
    overflow-x: hidden;
  }
  /deep/ .el-dialog__body {
    padding-bottom: 20px;
  }
  /deep/ .closeBtn {
    text-align: right;
  }
}
</style>

<script>
export default {
  components: {},
  props: {
    previewDialogShow: {
      type: Boolean,
      default: false
    },
    previewObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    fileName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    dialogClose() {
      this.$emit('cancelPreviewDailog', false)
    }
  }
}
</script>
