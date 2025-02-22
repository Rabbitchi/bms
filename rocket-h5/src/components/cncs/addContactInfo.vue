<!--
	作者：ganshengqu
	时间：2019-11-19
	描述：cncs中添加合同弹窗
	路径： import AddContactInfo from '@/components/cncs/addContactInfo.vue';
-->
<template>
  <div class="add-contact-info">
    <el-dialog
      title="ADD a contact info"
      :visible.sync="addContactShow"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form">
        <el-form-item label="Cust Name" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Contact Type">
          <el-select
            v-model.trim="contactType"
            value-key="contactName"
            placeholder
            @change="selectType"
          >
            <el-option
              :label="item.contactName"
              :value="item"
              v-for="(item, index) in addContactTypeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Contact Phone No" prop="mobile">
          <el-input
            v-model.trim="form.mobile"
            autocomplete="off"
            maxlength="11"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="comfirm" @click.stop="comfirm">Confirm</el-button>
        <el-button class="cancle" @click.stop="cancle">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.add-contact-info {
  width: 100%;
}
.add-contact-info /deep/ .el-dialog {
  width: 754px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.11);
  border-radius: 8px;
  .el-dialog__header {
    padding: 33px 31px 0 32px;
    .el-dialog__headerbtn {
      display: none;
    }
    .el-dialog__title {
      font-family: Avenir-Black;
      font-size: 20px;
      color: #000000;
      font-weight: 600;
    }
  }
  .el-dialog__body {
    width: 100%;
    box-sizing: border-box;
    padding: 24px 31px 48px 32px;
    .el-form {
      width: 100%;
      *zoom: 1;
      .el-form-item {
        width: 50%;
        float: left;
        margin-bottom: 20px;
        .el-form-item__label {
          width: 143px;
          box-sizing: border-box;
          text-align: right;
          float: left;
          font-family: Avenir-Book;
          padding-right: 0 20 0 0px;
          font-size: 14px;
          color: #606266;
          letter-spacing: 0;
        }
        .el-form-item__content {
          width: calc(100% - 143px);
          float: left;
        }
      }
      .el-form-item:last-child {
        margin-bottom: 0;
      }
    }
    .el-form:after {
      visibility: hidden;
      display: block;
      font-size: 0;
      content: ' ';
      clear: both;
      height: 0;
    }
  }
  .el-dialog__footer {
    padding: 0;
    height: 73px;
    padding-right: 31px;
    .el-button {
      margin: 0;
      float: right;
      border: 1px solid #409eff;
      border-radius: 4px;
      font-family: Avenir-Medium;
      font-size: 12px;
      color: #409eff;
    }
    .el-button:first-child {
      margin-left: 30px;
      background: #409eff;
      color: #ffffff;
    }
  }
}
</style>

<script>
export default {
  props: {
    addContactShow: {
      type: Boolean,
      default: false
    },
    addContactTypeList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        name: '',
        mobile: '',
        relation: ''
      },
      contactType: {}
    }
  },
  methods: {
    //取消
    cancle() {
      this.$emit('canclePoup')
    },
    //点击‘确认’
    comfirm() {
      let _this = this
      let reg = /^0(7|8|9)(0|1)\d{8}$/
      //校验手机号
      if (!reg.test(this.form.mobile)) {
        this.$message({
          message: 'Contact Phone error !',
          type: 'warning',
          offset: 300
        })
        return false
      }
      if (!_this.form.name) {
        this.$message.warning({
          message: 'cust name is required !',
          offset: 300
        })
        return false
      }
      if (!_this.contactType.contactName) {
        this.$message.warning({
          message: 'contact type must be selected !',
          offset: 300
        })
        return false
      }
      let data = {
        data: {
          bvn: _this.$route.query.bvn,
          mobile: _this.form.mobile,
          name: _this.form.name,
          relationship: _this.contactType.contactName
        }
      }
      this.$emit('comfirmAddContact', data)
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.contactType = {}
      })
    },
    selectType(e) {
      this.contactType = e
    }
  }
}
</script>
