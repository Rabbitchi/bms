<!--
	作者：ganshengqu
	时间：2020-05-26
	描述：编辑创建弹窗
-->
<template>
  <!-- 2.1将fileUrl修改为batchNo了 -->
  <div class="create-dialog">
    <el-dialog
      title="创建/编辑"
      :visible.sync="dialogShow"
      :close-on-click-modal="false"
      :before-close="dialogClose"
    >
      <!--选项卡切换-->
      <el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
        <!--服务消息-->
        <el-tab-pane label="服务消息" name="service_msg">
          <el-form
            ref="serviceform"
            :rules="serviceformRules"
            :model="formObj"
            label-width="100px"
          >
            <el-form-item label="标题" prop="pushTitle">
              <el-input v-model="formObj.pushTitle" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="Push内容" prop="pushContent">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                v-model="formObj.pushContent"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属业务" prop="lineOfBusiness">
              <el-select v-model="formObj.lineOfBusiness" placeholder="请选择">
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跳转类型" prop="jumpType" class="special">
              <el-select
                v-model="formObj.jumpType"
                placeholder="请选择"
                @change="selectValue"
              >
                <el-option label="内部页面" value="innerJump"></el-option>
                <el-option label="外部链接" value="h5Jump"></el-option>
                <el-option label="不跳转" value="noJump"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="跳转路径"
              prop="jumpLink"
              v-if="formObj.jumpType !== 'noJump'"
              class="special"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入链接地址"
                v-model="formObj.jumpLink"
                v-if="formObj.jumpType == 'h5Jump'"
              ></el-input>
              <el-select v-model="formObj.jumpLink" placeholder="请选择" v-else>
                <el-option label="APP首页" value="homeComponent"></el-option>
                <el-option
                  label="Xcross主页"
                  value="xcrossComponent"
                ></el-option>
                <el-option label="提现页" value="taleCashComponent"></el-option>
                <el-option label="还款页" value="myloanComponent"></el-option>
                <el-option
                  label="绑账户申请页"
                  value="addBankAccountComponent"
                ></el-option>
                <el-option
                  label="绑卡申请页"
                  value="addBankCardComponent"
                ></el-option>
                <el-option
                  label="授信申请页"
                  value="creditPageComponent"
                ></el-option>
                <el-option
                  label="我的优惠券页"
                  value="myCouponComponent"
                ></el-option>
                <el-option
                  label="提额任务页"
                  value="creditLimitComponent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发送类型" prop="startType">
              <el-radio-group v-model="formObj.startType" size="medium">
                <el-radio border label="INSTANT">即时发送</el-radio>
                <!-- <el-radio border label="TIMING">定时发送</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="定时发送" v-if="formObj.startType=='TIMING'" prop="startTime">
              <el-date-picker
                v-model="formObj.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="选择名单" prop="batchNo">
              <el-button
                size="small"
                class="userSelect"
                @click.stop="selectList"
              >
                选择
              </el-button>
              <span class="userSelectTXT">{{ formObj.batchNo }}</span>
            </el-form-item>
            <!-- <el-form-item label="用户群体" prop="userGroup">
              <el-radio-group v-model="formObj.userGroup" size="medium">
                <el-radio border label="filted">筛选用户</el-radio>
                <el-radio border label="specified">导入名单</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label v-if="formObj.userGroup=='filted'">
              <el-button type="primary" @click="userFiltrateClick">请筛选</el-button>
              <span
                v-if="formObj.userGroup=='filted' && filterUserTotal && formObj.fileUrl"
                class="userTotal"
              >
                名单数量：&nbsp;
                <span class="bold">{{ filterUserTotal }}</span>
              </span>
            </el-form-item> -->
            <!-- <el-form-item label v-if="formObj.userGroup=='specified'">
              <ImportList
                @getBinaryData="getBinaryData"
                purpose="push"
                importType="excel"
                requiredColumns="cust_id, firebase_token"
              />
            </el-form-item> -->
            <el-form-item size="large">
              <el-button
                type="primary"
                @click="onSubmit('serviceform')"
                :disabled="formObj.batchNo == ''"
              >
                提交
              </el-button>
              <!-- <el-button type="primary" @click="exportTemplate">导出push模板</el-button> -->
              <el-button @click="cancelDailog">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--优惠活动-->
        <el-tab-pane label="优惠活动" name="preferential_activity">
          <el-form
            ref="promotionsForm"
            :rules="promotionsFormRules"
            :model="formObj"
            label-width="100px"
          >
            <el-form-item label="标题" prop="pushTitle">
              <el-input v-model="formObj.pushTitle" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="Push内容" prop="pushContent">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                v-model="formObj.pushContent"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属业务" prop="lineOfBusiness">
              <el-select v-model="formObj.lineOfBusiness" placeholder="请选择">
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="跳转类型" prop="jumpType" class="special">
              <el-select
                v-model="formObj.jumpType"
                placeholder="请选择"
                @change="selectValue"
              >
                <el-option label="内部页面" value="innerJump"></el-option>
                <el-option label="外部链接" value="h5Jump"></el-option>
                <el-option label="不跳转" value="noJump"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="跳转路径"
              prop="jumpLink"
              v-if="formObj.jumpType !== 'noJump'"
              class="special"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入链接地址"
                v-model="formObj.jumpLink"
                v-if="formObj.jumpType == 'h5Jump'"
              ></el-input>
              <el-select v-model="formObj.jumpLink" placeholder="请选择" v-else>
                <el-option label="APP首页" value="homeComponent"></el-option>
                <el-option
                  label="Xcross主页"
                  value="xcrossComponent"
                ></el-option>
                <el-option label="提现页" value="taleCashComponent"></el-option>
                <el-option
                  label="还款页"
                  value="creditPageComponent"
                ></el-option>
                <el-option
                  label="绑账户申请页"
                  value="myloanComponent"
                ></el-option>
                <el-option
                  label="绑卡申请页"
                  value="addBankCardComponent"
                ></el-option>
                <el-option
                  label="授信申请页"
                  value="messageCenterComponent"
                ></el-option>
                <el-option
                  label="我的优惠券页"
                  value="myCouponComponent"
                ></el-option>
                <el-option
                  label="提额任务页"
                  value="creditLimitComponent"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上传图片" prop="pictureUrl">
              <!--图片地址 formObj.pictureUrl -->
              <ImportList
                @getBinaryData="getPictureBinaryData"
                purpose="image"
                ref="imgImport"
              />
            </el-form-item>
            <el-form-item label="发送类型" prop="startType">
              <el-radio-group v-model="formObj.startType" size="medium">
                <el-radio border label="INSTANT">即时发送</el-radio>
                <!-- <el-radio border label="TIMING">定时发送</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="定时发送" v-if="formObj.startType=='TIMING'" prop="startTime">
              <el-date-picker
                v-model="formObj.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="选择名单" prop="batchNo">
              <el-button
                size="small"
                class="userSelect"
                @click.stop="selectList"
              >
                选择
              </el-button>
              <span class="userSelectTXT">{{ formObj.batchNo }}</span>
            </el-form-item>
            <!-- <el-form-item label="用户群体" prop="userGroup">
              <el-radio-group v-model="formObj.userGroup" size="medium">
                <el-radio border label="filted">筛选用户</el-radio>
                <el-radio border label="specified">导入名单</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label v-if="formObj.userGroup=='filted'">
              <el-button type="primary" @click.stop="userFiltrateClick">请筛选</el-button>
              <span
                v-if="formObj.userGroup=='filted' && filterUserTotal && formObj.batchNo"
                class="userTotal"
              >
                名单数量：&nbsp;
                <span class="bold">{{ filterUserTotal }}</span>
              </span>
            </el-form-item>
            <el-form-item label v-if="formObj.userGroup=='specified'">
              <ImportList
                @getBinaryData="getBinaryData"
                purpose="push"
                importType="excel"
                requiredColumns="cust_id, firebase_token"
              />
            </el-form-item> -->
            <el-form-item size="large">
              <el-button
                type="primary"
                @click="onSubmit('promotionsForm')"
                :disabled="formObj.batchNo == '' || formObj.pictureUrl == ''"
              >
                提交
              </el-button>
              <!-- <el-button type="primary" @click="exportTemplate">导出push模板</el-button> -->
              <el-button @click="cancelDailog">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <!--系统公告-->
        <el-tab-pane label="系统公告" name="system_notice">
          <el-form
            ref="systemForm"
            :rules="systemFormRules"
            :model="formObj"
            label-width="100px"
          >
            <el-form-item label="标题" prop="pushTitle">
              <el-input v-model="formObj.pushTitle" maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="Push内容" prop="pushContent">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                maxlength="200"
                v-model="formObj.pushContent"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
            <el-form-item label="所属业务" prop="lineOfBusiness">
              <el-select v-model="formObj.lineOfBusiness" placeholder="请选择">
                <el-option
                  v-for="(item, index) in productList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="署名" prop="signature">
              <el-input v-model="formObj.signature" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="公告内容" :required="true">
              <!--公告内容 formObj.noticeContent  -->
              <TinymceEditor @getContent="getContent" ref="noticePushContnet" />
            </el-form-item>
            <el-form-item label="发送类型" prop="startType">
              <el-radio-group v-model="formObj.startType" size="medium">
                <el-radio border label="INSTANT">即时发送</el-radio>
                <!-- <el-radio border label="TIMING">定时发送</el-radio> -->
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="定时发送" v-if="formObj.startType=='TIMING'" prop="startTime">
              <el-date-picker
                v-model="formObj.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="pickerOptions"
                format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item> -->
            <el-form-item label="选择名单" prop="batchNo">
              <el-button
                size="small"
                class="userSelect"
                @click.stop="selectList"
              >
                选择
              </el-button>
              <span class="userSelectTXT">{{ formObj.batchNo }}</span>
            </el-form-item>
            <!-- <el-form-item label="用户群体" prop="userGroup">
              <el-radio-group v-model="formObj.userGroup" size="medium">
                <el-radio border label="filted">筛选用户</el-radio>
                <el-radio border label="specified">导入名单</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <!-- <el-form-item label v-if="formObj.userGroup=='filted'">
              <el-button type="primary" @click.stop="userFiltrateClick">请筛选</el-button>
              <span
                v-if="formObj.userGroup=='filted' && filterUserTotal && formObj.batchNo"
                class="userTotal"
              >
                名单数量：&nbsp;
                <span class="bold">{{ filterUserTotal }}</span>
              </span>
            </el-form-item>
            <el-form-item label v-if="formObj.userGroup=='specified'">
              <ImportList
                @getBinaryData="getBinaryData"
                purpose="push"
                importType="excel"
                requiredColumns="cust_id, firebase_token"
              />
            </el-form-item> -->
            <el-form-item size="large">
              <el-button type="primary" @click="Preview">预览</el-button>
              <!-- <el-button type="primary" @click="exportTemplate">导出push模板</el-button> -->
              <el-button
                type="primary"
                @click="onSubmit('systemForm')"
                :disabled="formObj.batchNo == ''"
              >
                提交
              </el-button>
              <el-button @click="cancelDailog">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--筛选用户弹出框-->
    <FilterUsersDailog
      :filterUserDialog="filterUserDialog"
      @filterUserDailogClose="filterUserDailogClose"
      @successFilter="successFilter"
    />
    <!--系统公告预览-->
    <NoticePreview
      :previewDialogShow="previewDialogShow"
      :previewObj="formObj"
      @cancelPreviewDailog="cancelPreviewDailog"
      :fileName="fileName"
    />
    <!--图片预览-->
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
    <DataListSelector
      :showDialogBatchNo.sync="showDialogBatchNo"
      @selectBatch="selectBatch"
    />
  </div>
</template>

<style lang="scss" scoped>
.create-dialog {
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
  }
  /deep/ .el-tabs__item {
    height: 40px;
    line-height: 40px;
  }
  /deep/ .el-tabs--border-card > .el-tabs__content {
    padding-top: 25px;
  }
  /deep/ .special {
    width: 40%;
    display: inline-block;
  }
  .pTitleRight {
    width: 150px;
    height: 150px;
    border: 1px dashed #c1c1c1;
    border-radius: 10px;
    overflow: hidden;
    line-height: 150px;
    text-align: center;
    position: relative;
    display: block;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .upload_cover {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      text-align: center;
      line-height: 150px;
      i {
        font-size: 22px;
        color: #ffffff;
        cursor: pointer;
        display: none;
      }
      i.el-icon-zoom-in {
        margin-right: 25px;
      }
    }
    .upload_cover:hover {
      background: rgba(0, 0, 0, 0.2);
      i {
        display: inline-block;
      }
    }
  }
  .userTotal {
    margin-left: 40px;
    .bold {
      font-weight: 600;
    }
  }
}
.el-date-picker {
  .el-button--text {
    display: none !important;
    color: red;
  }
}
.userSelect {
  font-size: 14px;
  color: #606266;
}
.userSelectTXT {
  margin-left: 10px;
}
</style>

<script>
import TinymceEditor from '@/components/TinymceEditor'
import FilterUsersDailog from '@/components/bfs/filterUsersDailog'
import NoticePreview from '@/components/bfs/noticePreview'
import DataListSelector from '@/components/bfs/dataListSelector'
import ImportList from '@/components/bfs/importList'
import { mapGetters } from 'vuex'
import { savePushMsgTask } from '@/api/bfs/letterManagement'
import { getProduct } from '@/api/mkt/stragety.js'
export default {
  components: {
    TinymceEditor,
    FilterUsersDailog,
    ImportList,
    NoticePreview,
    DataListSelector
  },
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      productList: [],
      showDialogBatchNo: false, // 选择名单弹窗
      //控制切换
      activeName: 'service_msg',
      //创建共用一个接口（绑定统一表单对象）
      formObj: {
        pushType: 'service_msg',
        pushTitle: '',
        pushContent: '',
        lineOfBusiness: '',
        jumpLink: '',
        jumpType: '',
        startType: '',
        startTime: '',
        pictureUrl: '',
        signature: '',
        userGroup: '',
        batchNo: '',
        // fileUrl: "",
        noticeContent: '',
        messageType: '',
        createUser: ''
      },
      fileName: '',
      //筛选用总数
      filterUserTotal: null,
      //服务消息筛选
      filterUserDialog: false,
      imgDialogVisible: false,
      dialogImageUrl: '',
      //服务消息校验规则
      serviceformRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        lineOfBusiness: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpLink: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ],
        startType: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        // userGroup: [
        //   { required: true, message: "请选择用户群体", trigger: "change" }
        // ]
        batchNo: [{ required: true, message: '请选择名单', trigger: 'change' }]
      },
      //优惠活动校验规则
      promotionsFormRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        lineOfBusiness: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpLink: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ],
        pictureUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        startType: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        // userGroup: [
        //   { required: true, message: "请选择用户群体", trigger: "change" }
        // ]
        batchNo: [{ required: true, message: '请选择名单', trigger: 'change' }]
      },
      //系统公告校验规则
      systemFormRules: {
        pushTitle: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        pushContent: [
          { required: true, message: '请填写Push内容', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ],
        lineOfBusiness: [
          { required: true, message: '请选择所属业务', trigger: 'change' }
        ],
        jumpType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        jumpLink: [
          { required: true, message: '请设置跳转路径', trigger: 'change' }
        ],
        startType: [
          { required: true, message: '请选择发送类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择发送时间', trigger: 'change' }
        ],
        // userGroup: [
        //   { required: true, message: "请选择用户群体", trigger: "change" }
        // ],
        batchNo: [{ required: true, message: '请选择名单', trigger: 'change' }],
        signature: [
          { required: true, message: '请填写署名', trigger: 'blur' },
          { min: 1, trigger: 'blur' }
        ]
      },
      //系统公告预览弹窗
      previewDialogShow: false,
      // 设置只能选择当前日期及之后的日期
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 //如果没有后面的-8.64e7就是不可以选择今天的
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name'])
  },
  watch: {
    dialogShow(val) {
      if (val) this.getProduct()
    }
  },
  created() {
    // this.productList = [
    //   "PalmCredit",
    //   "EasyBuy",
    //   "NewCredit",
    //   "Xcrosscash",
    //   "Xcash",
    //   "PC-XCross",
    //   "EB-XCross"
    // ]
    // this.getProduct();
  },
  methods: {
    // 获取业务线枚举
    getProduct() {
      let arr = JSON.parse(sessionStorage.getItem('omsProList'))
      if (arr && arr.length > 0) {
        this.productList = arr
      } else {
        getProduct().then((res) => {
          this.productList = res.data
          sessionStorage.setItem('omsProList', JSON.stringify(this.productList))
          // JSON.parse(sessionStorage.getItem('omsProList'))
        })
      }
    },
    //导出模板
    exportTemplate() {
      import('@/vendor/Export2Excel')
        .then((excel) => {
          const tHeader = ['uid', 'cust_id', 'firebase_token']
          const filterVal = ['uid', 'cust_id', 'firebase_token']
          let responseData = [{ uid: '', cust_id: '', firebase_token: '' }]
          const data = this.formatJson(filterVal, responseData)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'push模板'
          })
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    // 选择名单
    selectList() {
      this.showDialogBatchNo = true
    },
    selectBatch(row) {
      if (row) {
        this.formObj.batchNo = row.batchNo
        console.log(this.formObj)
        this.$message({
          message: '选择成功',
          type: 'success'
        })
      }
    },
    formatJson(filterVal, jsonData) {
      console.log(filterVal)
      console.log(jsonData)
      return jsonData.map((v) =>
        filterVal.map((j) => {
          return v[j]
        })
      )
    },
    //tab切换时，清空对象属性值;重新给 pushType赋值
    handleClick(tab) {
      let obj = this.formObj
      Object.keys(obj).forEach((key) => (obj[key] = ''))
      //恢复"pushType"的默认值
      this.formObj.pushType = 'service_msg'
      let labelName = tab.name
      if (labelName === 'service_msg') {
        this.formObj.pushType = 'service_msg'
        this.$refs['serviceform'].resetFields()
        this.clearImg()
        this.clearPushContent()
      } else if (labelName === 'preferential_activity') {
        this.formObj.pushType = 'preferential_activity'
        this.$refs['promotionsForm'].resetFields()
        this.clearPushContent()
      } else {
        this.formObj.pushType = 'system_notice'
        this.$refs['systemForm'].resetFields()
        this.clearImg()
      }
    },
    //清空第二个tab图片
    clearImg() {
      this.$refs.imgImport.clearImgEvent()
    },
    //关闭弹窗或者切换tab时，需要清空content
    clearPushContent() {
      this.$refs.noticePushContnet.clearNoticeContent()
      //清空 筛选的用户数量
      this.filterUserTotal = null
    },
    getContent(content) {
      this.formObj.noticeContent = content
    },
    onSubmit(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.savePushMsg()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    imgPreview() {
      this.dialogImageUrl = this.formObj.pictureUrl
      this.imgDialogVisible = true
    },
    imgDelete() {
      this.formObj.pictureUrl = ''
    },
    selectValue(e) {
      if (e === 'h5Jump') {
        this.formObj.jumpLink = ''
      }
    },
    Preview() {
      this.previewDialogShow = true
    },
    cancelDailog() {
      this.$emit('cancelDailog', false)
      this.clearPushContent()
      //清空选中图片
      this.clearImg()
    },
    dialogClose() {
      this.$emit('cancelDailog', false)
      //清空选中图片
      this.clearImg()
    },
    //请求创建接口
    savePushMsg() {
      let _this = this
      _this.formObj.createUser = _this.name
      let data = {
        page: {
          pageNum: 1,
          pageSize: 50,
          startIndex: 0,
          totalPage: 0,
          totalRecord: 0
        },
        data: _this.formObj
      }
      savePushMsgTask(data)
        .then((res) => {
          //提交成功时，清空弹窗数据
          let obj = _this.formObj
          Object.keys(obj).forEach((key) => (obj[key] = ''))
          //恢复pushType默认值
          _this.activeName = 'service_msg'
          _this.formObj.pushType = 'service_msg'
          _this.$emit('createSavedSuccess', false)
          //清空弹窗触发change的校验
          _this.$refs['serviceform'].resetFields()
          _this.$refs['promotionsForm'].resetFields()
          _this.$refs['systemForm'].resetFields()
        })
        .catch((e) => {
          console.log('error')
        })
    },
    //筛选用户
    userFiltrateClick() {
      this.filterUserDialog = true
    },
    //服务消息，筛选用户
    filterUserDailogClose() {
      this.filterUserDialog = false
    },
    //筛选成功
    successFilter(data) {
      this.filterUserDialog = false
      this.formObj.fileUrl = data.filterResult
      this.filterUserTotal = data.userCount
    },
    //导入名单
    importList() {
      this.dialogBatchImportVisible = true
    },
    //获取上传的excel表，返回的url
    getBinaryData(data) {
      this.formObj.fileUrl = data.fileUrl
      this.fileName = data.fileName
    },
    //获取图片
    getPictureBinaryData(data) {
      this.formObj.pictureUrl = data.fileUrl
    },
    cancelPreviewDailog() {
      this.previewDialogShow = false
    }
  }
}
</script>
