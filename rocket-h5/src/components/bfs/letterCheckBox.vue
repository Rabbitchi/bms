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
      <!--根据pushType判断查看的是哪个tab下的内容-->
      <!--消息类别:service_msg服务消息,preferential_activity优惠活动,system_notice系统公告-->
      <div v-if="checkObj.pushType=='service_msg'">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="checkObj.pushTitle" disabled></el-input>
          </el-form-item>
          <el-form-item label="Push内容">
            <el-input
              type="textarea"
              v-model="checkObj.pushContent"
              :autosize="{ minRows: 2, maxRows: 4}"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="所属业务">
            <el-select v-model="checkObj.lineOfBusiness" disabled></el-select>
          </el-form-item>
          <el-form-item label="跳转类型">
            <el-col :span="11">
              <el-select v-model="checkObj.jumpType" disabled></el-select>
            </el-col>
            <el-col class="line" :span="2">跳转路径</el-col>
            <el-col :span="11">
              <el-input
                type="textarea"
                autosize
                v-model="checkObj.region"
                v-if="checkObj.jumpType=='h5Jump'"
              ></el-input>
              <el-select v-model="checkObj.jumpLink" v-else disabled></el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="发送时间">
            <el-radio-group v-model="checkObj.startType" size="medium" disabled>
              <el-radio border label="INSTANT">即时发送</el-radio>
              <el-radio border label="TIMING">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户群体">
            <el-radio-group v-model="checkObj.userGroup" size="medium" disabled>
              <el-radio border label="filted">筛选用户</el-radio>
              <el-radio border label="specified">导入名单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div v-else-if="checkObj.pushType=='preferential_activity'">
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="checkObj.pushTitle" disabled></el-input>
          </el-form-item>
          <el-form-item label="Push内容">
            <el-input
              type="textarea"
              v-model="checkObj.pushContent"
              :autosize="{ minRows: 2, maxRows: 4}"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="所属业务">
            <el-select v-model="checkObj.lineOfBusiness" disabled></el-select>
          </el-form-item>
          <el-form-item label="跳转类型">
            <el-col :span="11">
              <el-select v-model="checkObj.jumpType" disabled></el-select>
            </el-col>
            <el-col class="line" :span="2">跳转路径</el-col>
            <el-col :span="11">
              <el-input
                type="textarea"
                autosize
                v-model="checkObj.jumpLink"
                v-if="checkObj.jumpType=='h5Jump'"
                disabled
              ></el-input>
              <el-select v-model="checkObj.jumpLink" v-else disabled></el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="上传图片">
            <div class="show_img">
              <img :src="checkObj.pictureUrl" />
            </div>
          </el-form-item>
          <el-form-item label="发送时间">
            <el-radio-group v-model="checkObj.startType" size="medium" disabled>
              <el-radio border label="INSTANT">即时发送</el-radio>
              <el-radio border label="TIMING">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="定时发送" v-if="checkObj.pushTime=='TIMING'">
            <el-date-picker
              v-model="checkObj.startTime"
              disabled
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="用户群体">
            <el-radio-group v-model="checkObj.userGroup" size="medium" disabled>
              <el-radio border label="filted">筛选用户</el-radio>
              <el-radio border label="specified">导入名单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="checkObj.pushTitle" disabled></el-input>
          </el-form-item>
          <el-form-item label="Push内容">
            <el-input
              type="textarea"
              v-model="checkObj.pushContent"
              :autosize="{ minRows: 2, maxRows: 4}"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="所属业务">
            <el-select v-model="checkObj.lineOfBusiness" disabled></el-select>
          </el-form-item>
          <el-form-item label="署名">
            <el-input v-model="checkObj.signature" disabled></el-input>
          </el-form-item>
          <el-form-item label="公告内容">
            <div v-html="checkObj.noticeContent" class="notice_content"></div>
          </el-form-item>
          <el-form-item label="发送时间">
            <el-radio-group v-model="checkObj.startType" size="medium" disabled>
              <el-radio border label="INSTANT">即时发送</el-radio>
              <el-radio border label="TIMING">定时发送</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="定时发送" v-if="checkObj.startType=='TIMING'">
            <el-date-picker
              v-model="checkObj.startTime"
              disabled
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="用户群体">
            <el-radio-group v-model="checkObj.userGroup" size="medium" disabled>
              <el-radio border label="filted">筛选用户</el-radio>
              <el-radio border label="specified">导入名单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
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
  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #666666;
  }
  .show_img {
    width: 250px;
    height: 200px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .notice_content {
    width: 100%;
    overflow-x: hidden;
    border-radius: 4px;
    background-color: #f5f7fa;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    padding: 5px 15px 5px 15px;
    min-height: 45px;
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
