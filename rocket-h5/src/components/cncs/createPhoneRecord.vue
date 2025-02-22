<!--
	作者：ganshengqu
	时间：2019-11-19
	描述：cncs中创建手机号记录
	路径： import CreatePhoneRecord from '@/components/cncs/createPhoneRecord.vue';
-->
<template>
  <div class="add-send-message">
    <!--内容-->
    <el-form :model="form" class="clearfix">
      <el-row>
        <el-form-item label="Contact Type">
          <el-select
            v-model="form.contactType"
            placeholder
            @change="selectContactType"
          >
            <el-option
              :label="item.contactType"
              :value="item.contactType"
              v-for="(item, index) in contactTypeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Contact Phone">
          <el-input
            v-model="contactPhone"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="Action Code">
          <el-select
            v-model="form.actionCode"
            placeholder="Select Action Code"
            :disabled="form.contactType === '' ? true : false"
            @change="selectActionCode"
          >
            <el-option
              :label="item.actionCode"
              :value="item.actionCode"
              v-for="(item, index) in checkActionCode"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.actionCode === 'paid'" label="Paid Date">
          <el-date-picker
            v-model="form.paidDate"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item v-if="form.actionCode === 'paid'" label="Paid Amount">
          <el-input
            v-model="form.paidAmount"
            type="number"
            autocomplete="off"
            @input="oninput"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="Language">
          <el-select v-model="form.actionLanguage" placeholder>
            <el-option label="English" value="English"></el-option>
            <el-option label="Yoruba" value="Yoruba"></el-option>
            <el-option label="Hausa" value="Hausa"></el-option>
            <el-option label="Igbo" value="Igbo"></el-option>
            <el-option label="Pidgin" value="Pidgin"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="Actual Of Commit-Date">
          <el-input v-model="form.actualCommitDate" autocomplete="off" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="End Of Commit-Date">
          <el-input
            v-model="form.endOfCommitDate"
            autocomplete="off"
            disabled
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          class="checked_item"
          v-if="form.actionCode === 'PTP'"
          label="Charge"
        >
          <el-checkbox class="checkbox" v-model="checked"></el-checkbox>
          <el-input
            v-model="form.commitAmount"
            autocomplete="off"
            type="number"
            @input="commitAmountInput"
          ></el-input>
        </el-form-item>
        <el-form-item class="bankCard" label="Charge Bank Card">
          <el-select
            v-model="chargeData.cardNo"
            placeholder
            :disabled="!checked"
          >
            <el-option
              :label="item.cardNo"
              :value="item.cardNo"
              v-for="(item, index) in bankList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-form-item class="checked_item" label="Whatsapp">
          <el-checkbox class="checkbox" v-model="hasWhatsApp"></el-checkbox>
          <UploadFile
            v-if="hasWhatsApp"
            :show-file-list="false"
            :max-size="51200"
            :max="3"
            accept="image/*"
            :disabled="isUploading"
            :value="images"
            :button-text="isUploading ? 'Uploading' : 'Upload'"
            @beforeUpload="handleBeforeUpload"
            @error="handleUploadError"
            @success="handleUploadSuccess"
          />
        </el-form-item>
      </el-row>
      <el-row
        v-if="hasWhatsApp && images.length > 0"
        type="flex"
        class="filelist"
      >
        <div
          class="image_wrapper"
          v-for="(item, index) in images"
          :key="item.objectKey"
        >
          <el-image
            class="image"
            :src="item.url"
            fit="contain"
            :preview-src-list="images.map((item) => item.url)"
          />
          <div
            class="btn_delete el-icon-close"
            @click="removeImage(index)"
          ></div>
        </div>
      </el-row>
      <el-row type="flex" justify="space-between">
        <el-form-item class="remark" label="Remark">
          <el-input
            v-model="form.remark"
            autocomplete="off"
            type="textarea"
            autosize
            maxlength="2000"
          ></el-input>
        </el-form-item>
        <el-button class="btn_offline" type="danger" @click="showOffline">
          offline payment
        </el-button>
        <el-form-item class="btn">
          <el-button class="cancle" @click="cancle">Reset</el-button>
          <el-button class="save" @click="save" type="primary">
            Submit
          </el-button>
          <el-button class="submit" @click="submit" type="primary">
            Save and Next
          </el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.add-send-message {
  /deep/ .el-form {
    width: 100%;
    box-sizing: border-box;
    padding: 0 52px;
    .el-form-item {
      width: 30%;
      float: left;
      .el-form-item__label {
        text-align: left;
      }
      .el-form-item__content {
        margin-left: 150px;
      }
      .el-input {
        width: auto;
        height: 38px;
        .el-input__inner {
          height: 38px;
        }
      }
      &.checked_item {
        position: relative;

        .el-form-item__label {
          padding-left: 25px;
        }

        .checkbox {
          position: absolute;
          left: -150px;
        }
      }
      &.remark {
        width: 60%;
      }
      &.btn {
        width: 40%;
      }
    }
    .filelist {
      box-sizing: border-box;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
      .image_wrapper {
        width: calc((100% - 80px) / 3);
        max-height: 160px;
        position: relative;
        margin-right: 20px;
        .image {
          width: 100%;
          height: 100%;
        }

        .btn_delete {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
          color: red;
        }
      }
    }
    .btn_offline {
      margin-left: 20px;
      height: 38px;
    }
  }
}
</style>

<script>
import UploadFile from '@/components/Upload/UploadFile'
import {
  queryActionCode,
  queryPTPLifeConfig,
  queryContactType
} from '@/api/cncs/processing'
export default {
  components: {
    UploadFile
  },
  props: {
    overdueDay: {
      type: [String, Number],
      default() {
        return ''
      }
    },
    contactPhone: {
      type: String,
      default() {
        return ''
      }
    },
    viewPhone: {
      type: String,
      default: ''
    },
    contactType: {
      type: String,
      default() {
        return ''
      }
    },
    withholdingAmount: {
      type: Number
    },
    bankList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        contactType: this.contactType,
        actionCode: '',
        remark: '',
        actionLanguage: 'English',
        // actualCommitDate: "",
        endOfCommitDate: '',
        paidAmount: '',
        paidDate: '',
        commitAmount: 0,
        whatsAppPhotos: []
      },
      images: [],
      //行动代码查询
      checkActionCode: [],
      //默认勾选
      checked: false,
      hasWhatsApp: false,
      contactTypeList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      chargeData: {
        cardNo: ''
      },
      isUploading: false
    }
  },
  watch: {
    contactType(newValue, oldValue) {
      this.form.contactType = this.contactType
      this.selectContactType(this.contactType)
    }
  },
  mounted() {
    let _this = this
    _this.getContactType()
    let contactType = _this.form.contactType
    if (contactType) {
      let data = { data: contactType }
      queryActionCode(data)
        .then((response) => {
          _this.checkActionCode = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    }
    //  给银行卡默认值，如果没有则为空
    _this.chargeData.cardNo =
      _this.bankList.length > 0 ? _this.bankList[0].cardNo : ''
  },
  methods: {
    cancle() {
      this.$confirm('your record will be reset!', 'warning')
        .then(() => {
          this.$emit('closeRecord')
        })
        .catch((e) => {})
    },
    save() {
      this.submit(false)
    },
    submit(goNext = true) {
      if (!this.form.actionCode) {
        this.$message.error({
          offset: 300,
          message: 'actionCode is empty!'
        })
      } else if (
        this.form.actionCode === 'paid' &&
        (!this.form.paidDate || !this.form.paidAmount)
      ) {
        this.$message({
          message: 'Paid Date or Paid Amount is empty!',
          type: 'error'
        })
      } else if (!this.contactPhone) {
        this.$message({
          message: 'Contact Phone is empty!',
          type: 'error'
        })
      } else if (this.hasWhatsApp && !this.form.whatsAppPhotos.length) {
        this.$message({
          message:
            'Whatsapp screenshot is empty! Please upload screenshot and try again.',
          type: 'error'
        })
      } else {
        //提交charge需要的参数
        let formCharge = {
          bankCardNo: this.chargeData.cardNo,
          custId: this.$route.query.custId,
          repayAmt: this.form.commitAmount
        }
        let data = {
          formCharge: formCharge,
          form: this.form,
          contactPhone: this.contactPhone,
          chargeStatus: this.checked,
          displayMode: this.hasWhatsApp ? 'whatsApp' : ''
        }
        //将提交charge和催记数据一起传到父组件
        this.$emit('submitRecord', data, goNext)
      }
    },
    //选定 Contact Type，需要 查询  Action Code
    selectContactType(e) {
      let data = { data: e }
      let _this = this
      _this.form.actionCode = ''
      // _this.form.actualCommitDate = "";
      _this.form.endOfCommitDate = ''
      queryActionCode(data)
        .then((response) => {
          _this.checkActionCode = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //获取联系人类型
    getContactType() {
      let _this = this
      queryContactType({ data: {} })
        .then((response) => {
          _this.contactTypeList = response.data
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //当选定的action code 是ptp时，需要请求接口
    selectActionCode(e) {
      let _this = this
      if (e === 'PTP') {
        let data = { data: _this.overdueDay }
        queryPTPLifeConfig(data)
          .then((response) => {
            let getPtpLife = response.data[0].ptpLife
            let timeStr = '-'
            let curDate = new Date()
            let curDateTimeStamp = curDate.getTime()
            let endDateTimeStamp =
              curDateTimeStamp + 24 * 3600 * 1000 * getPtpLife
            let endDate = new Date(endDateTimeStamp)
            let endYear = endDate.getFullYear()
            let endMonth = '' + (endDate.getMonth() + 1)
            let endDay = '' + endDate.getDate()
            if (endMonth.length < 2) {
              endMonth = '0' + endMonth
            }
            if (endDay.length < 2) {
              endDay = '0' + endDay
            }
            _this.form.endOfCommitDate = [endYear, endMonth, endDay].join(
              timeStr
            )
          })
          .catch((err) => {
            console.log(err)
          })
        _this.form.commitAmount = _this.withholdingAmount
      } else {
        _this.form.commitAmount = ''
        _this.form.paidAmount = ''
        _this.form.paidDate = ''
        _this.form.endOfCommitDate = ''
      }
    },
    oninput(e) {
      this.form.paidAmount = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
    },
    commitAmountInput(e) {
      if (e < 0) {
        this.form.commitAmount = 0
      } else if (e > this.withholdingAmount) {
        this.form.commitAmount = this.withholdingAmount
      } else {
        this.form.commitAmount = e.match(/^\d*(\.?\d{0,2})/g)[0] || null
      }
    },
    showOffline() {
      this.$emit('showOffline')
    },
    handleBeforeUpload() {
      this.isUploading = true
    },
    handleUploadError() {
      this.$message.error('upload fail!please checkout your network.')
      this.isUploading = false
    },
    handleUploadSuccess(fileObj) {
      this.isUploading = false
      this.$message.success('upload success!')
      this.images.push(fileObj)
      this.form.whatsAppPhotos.push({
        objectKey: fileObj.objectKey,
        photoName: fileObj.name
      })
    },
    removeImage(index) {
      this.images.splice(index, 1)
      this.form.whatsAppPhotos.splice(index, 1)
    },
    cancel() {
      this.$emit('update:showOffline', false)
    }
  }
}
</script>
