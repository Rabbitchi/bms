<!--
	作者：ganshengqu
	时间：2020-02-10
	描述：需要增加一个根据id查询产品详情的接口
-->
<template>
  <div class="table_container">
    <h3>Basic product information</h3>
    <el-divider></el-divider>
    <!--返显详情信息 start-->
    <div class="dialog_form_wrap clearfix">
      <el-form :model="detailsForm" label-width="140px" class="clearfix">
        <el-row>
          <el-col :span="8">
            <el-form-item label="Product category:" :required="true">
              <el-select
                v-model="detailsForm.productCatagory"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Transaction scenario :" :required="true">
              <el-select
                v-model="detailsForm.txnScene"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Product NO.:" :required="true">
              <el-input
                v-model="detailsForm.productId"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Product name :" :required="true">
              <el-input
                v-model="detailsForm.productName"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Product description :" :required="true">
              <el-select
                v-model="detailsForm.productDesc"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Product Status:" :required="true">
              <el-select
                v-model="detailsForm.status"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="Maximal allowed days to charge penalty interest:"
              :required="true"
            >
              <el-input
                v-model="detailsForm.maxOverdueDays"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Order split config id:" :required="true">
              <el-select
                v-model="detailsForm.offsetSeq"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Limit type:" :required="true">
              <el-select
                v-model="detailsForm.lmtType"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="Whether to allow multiple borrowings:"
              :required="true"
            >
              <el-select
                v-model="detailsForm.multiLoanFlag"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Offset sequence :" :required="true">
              <el-select
                v-model="detailsForm.offsetSeq"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Repayment method :" :required="true">
              <el-input
                v-model="detailsForm.loanType"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Account type:" :required="true">
              <el-input
                v-model="detailsForm.acctType"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Hesitation period :" :required="true">
              <el-select
                v-model="detailsForm.coolingOffPeriod"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="No.of contract template:" :required="true">
              <el-input
                v-model="detailsForm.contractCode"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Min Product Price:" :required="true">
              <el-input
                v-model="detailsForm.minProductPrice"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Max Product Price:" :required="true">
              <el-select
                v-model="detailsForm.maxProductPrice"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Min Loan Amount:" :required="true">
              <el-input
                v-model="detailsForm.minLoanAmount"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="Max Loan Amount:" :required="true">
              <el-input
                v-model="detailsForm.maxLoanAmount"
                autocomplete="off"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Min Downpayment Ratio:" :required="true">
              <el-select
                v-model="detailsForm.minDownpaymentRatio"
                placeholder
                disabled
              ></el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--返显详情信息 end-->
    <div class="table_list">
      <h3 style="margin-top: 20px">Product pricing parameter</h3>
      <el-divider></el-divider>
      <div class="table_list_btns" style="float: left; margin-bottom: 20px">
        <el-button class="btn" type="primary" @click="AddItem">+ Add</el-button>
      </div>
      <!--新增 start-->
      <el-dialog
        :title="
          dialogType == 'add' ? 'Add product price' : 'Modify product pricing'
        "
        :visible.sync="dialogFormVisible"
        custom-class="dialog_form_wrap"
        :before-close="dialogClose"
        top="9vh"
        width="60%"
      >
        <el-form
          :model="form"
          class="clearfix"
          :rules="rules"
          ref="form"
          label-width="160px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="Product pricing No.:" prop="productFeeId">
                <el-input
                  v-model="form.productFeeId"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Terms:" prop="term">
                <el-input
                  v-model="form.term"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Minimal amount :" prop="minAmt">
                <el-input
                  v-model="form.minAmt"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Maximal amount:" prop="maxAmt">
                <el-input
                  v-model="form.maxAmt"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="Interest rate table:" prop="interestRateId">
                <el-select v-model="form.interestRateId" placeholder>
                  <el-option
                    :label="item.name"
                    :value="item.interestRateId"
                    v-for="(item, index) in queryInterestList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Writ-off days:" prop="cancleAfterVerifyDay">
                <el-input
                  v-model.number="form.cancleAfterVerifyDay"
                  autocomplete="off"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Whether to allow settlement in advance :"
                prop="prePaymentFlag"
              >
                <el-select v-model="form.prePaymentFlag" placeholder>
                  <el-option label="Yes" value="Y"></el-option>
                  <el-option label="No" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Composition of advanced settlement amount:"
                prop="preFeeCalCompt"
              >
                <el-select v-model="form.preFeeCalCompt" placeholder>
                  <el-option
                    :label="Object.values(item)[0]"
                    :value="Object.keys(item)[0]"
                    v-for="(item, index) in productQueryProductFeeRelEnumList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Fee rate of advanced settlement :"
                prop="preFeeRate"
              >
                <el-input
                  v-model.number="form.preFeeRate"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Advance settlement of fixed amount :"
                prop="preFeeAmt"
              >
                <el-input
                  v-model.number="form.preFeeAmt"
                  autocomplete="off"
                  maxlength="16"
                  type="number"
                  @mousewheel.native.prevent
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Whether to charge penalty interest or not :"
                prop="overdueFlag"
              >
                <el-select v-model="form.overdueFlag" placeholder>
                  <el-option label="Yes" value="Y"></el-option>
                  <el-option label="No" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Penalty interest amount composition:"
                prop="overdueCalCompt"
              >
                <el-select v-model="form.overdueCalCompt" placeholder>
                  <el-option
                    :label="Object.values(item)[0]"
                    :value="Object.keys(item)[0]"
                    v-for="(item, index) in productQueryProductFeeRelEnumList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Penalty interest rate table:"
                prop="overdueRateId"
              >
                <el-select v-model="form.overdueRateId" placeholder>
                  <el-option
                    :label="item.name"
                    :value="item.overdueId"
                    v-for="(item, index) in overDuesList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Whether to charge Late Repayment Penalty or not:"
                prop="lateFeeFlag"
              >
                <el-select v-model="form.lateFeeFlag" placeholder>
                  <el-option label="Yes" value="Y"></el-option>
                  <el-option label="No" value="N"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="Late Repayment Penalty amount composition:"
                prop="lateCalCompt"
              >
                <el-select v-model="form.lateCalCompt" placeholder>
                  <el-option
                    :label="Object.values(item)[0]"
                    :value="Object.keys(item)[0]"
                    v-for="(item, index) in productQueryProductFeeRelEnumList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="Late Repayment Penalty table :"
                prop="lateFeeId"
              >
                <el-select v-model="form.lateFeeId" placeholder>
                  <el-option
                    :label="item.name"
                    :value="item.lateFeeId"
                    v-for="(item, index) in lateFeesList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>
            <el-col :span="12">
              <el-form-item label="核销天数：" prop="cancleAfterVerifyDay">
                <el-input v-model.number="form.cancleAfterVerifyDay" autocomplete="off" maxlength="16" type="number" @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Last loan overdue days:" prop="lastLoanOverdueDays">
                <el-input v-model.number="form.lastLoanOverdueDays" autocomplete="off" maxlength="16" type="number" @mousewheel.native.prevent></el-input>
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="No.of contract template:"
                prop="contractCode"
              >
                <el-select v-model="form.contractCode" placeholder>
                  <el-option
                    :label="item.contractName"
                    :value="item.contractCode"
                    v-for="(item, index) in contractTemplatesList"
                    :key="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="stagedPenalty">
            <h4>Expense:</h4>
            <el-button
              class="addBtn"
              @click="addFormItem"
              type="primary"
              icon="el-icon-plus"
              size="mini"
            >
              Add
            </el-button>
            <template v-if="form.feeList.length">
              <div class="formListItem">
                <el-form-item>Expense type</el-form-item>
                <el-form-item>Charging method</el-form-item>
                <el-form-item>Amount composition</el-form-item>
                <el-form-item>Fee rate</el-form-item>
                <el-form-item>Fixed amount</el-form-item>
                <el-form-item>Minimal amount</el-form-item>
                <el-form-item>Maximal amount</el-form-item>
                <el-form-item>Operation</el-form-item>
              </div>
              <div
                v-for="(item, index) in form.feeList"
                :key="index + '_size'"
                class="formListItem"
              >
                <el-form-item
                  :prop="'feeList.' + index + '.feeType'"
                  :rules="feeList.feeType"
                  required
                >
                  <el-select v-model="item.feeType" placeholder>
                    <el-option
                      v-for="(value, key, indexType) in feeTypeList"
                      :label="value"
                      :value="key"
                      :key="indexType"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.feeCollMethod'"
                  :rules="feeList.feeCollMethod"
                  required
                >
                  <el-select v-model="item.feeCollMethod" placeholder>
                    <el-option label="Receive on time" value="T"></el-option>
                    <el-option label="preCharge" value="P"></el-option>
                    <el-option label="First-stage charge" value="F"></el-option>
                    <el-option
                      label="Charge in final installment"
                      value="S"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.feeCalCompt'"
                  :rules="feeList.feeCalCompt"
                  required
                >
                  <el-select v-model="item.feeCalCompt" placeholder>
                    <el-option label="Full principal" value="AP"></el-option>
                    <el-option label="Overdue principal" value="OP"></el-option>
                    <el-option
                      label="Residual principal"
                      value="SP"
                    ></el-option>
                    <el-option label="All repayment" value="AR"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.feeRate'"
                  :rules="feeList.feeRate"
                  required
                >
                  <el-input v-model="item.feeRate" type="number"></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.feeAmt'"
                  :rules="feeList.feeAmt"
                  required
                >
                  <el-input v-model="item.feeAmt" type="number"></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.minAmt'"
                  :rules="feeList.minAmt"
                  required
                >
                  <el-input v-model="item.minAmt" type="number"></el-input>
                </el-form-item>
                <el-form-item
                  :prop="'feeList.' + index + '.maxAmt'"
                  :rules="feeList.maxAmt"
                  required
                >
                  <el-input v-model="item.maxAmt" type="number"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click.prevent="removeFormItem(item)">
                    Delete
                  </el-button>
                </el-form-item>
              </div>
            </template>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button class="cancle" @click="dialogFormVisible = false">
            Cancel
          </el-button>
          <el-button
            type="primary"
            @click="
              dialogType === 'add' ? comfirmAdd('form') : mdfConfirm('form')
            "
          >
            Confirm
          </el-button>
        </div>
      </el-dialog>
      <!--新增 end-->
      <!--表格  start-->
      <el-table
        ref="table"
        class="table"
        v-loading="listLoading"
        :data="tableData"
        max-height="600"
        border
        stripe
        empty-text="No data under current query"
      >
        <el-table-column label="Pricing NO." align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.productFeeId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Terms" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.term }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Minimal amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.minAmt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Maximal amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.maxAmt }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Interest rate table NO." align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.interestRateId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operation" width="270" align="center">
          <template slot-scope="scope">
            <el-button
              class="btn btn-default"
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="mdfRow(scope.row)"
            >
              Modify
            </el-button>
            <el-button
              class="btn btn-default"
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="deleteRow(scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  productQueryProduct,
  productAddDetail,
  productFeeUpdate,
  productFeeDelete,
  productQueryProductRelEnum,
  productFeeForm
} from '@/api/bfs/productManagement'
export default {
  name: 'OffsetSequencingMgt',
  components: {},
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      total: 0,
      tableData: [],
      detailsForm: {
        acctType: '',
        contractCode: '',
        coolingOffPeriod: 0,
        createTime: '',
        createUser: '',
        loanType: '',
        maxOverdueAmt: 0,
        maxOverdueDays: 0,
        multiLoanFlag: '',
        lmtType: '',
        offsetSeq: 0,
        productCatagory: '',
        productDesc: '',
        productId: 0,
        productName: '',
        splitConfigId: 0,
        status: '',
        txnScene: '',
        updateTime: '',
        updateUser: ''
      },
      form: {
        productFeeId: null,
        productId: null,
        term: null,
        minAmt: null,
        maxAmt: null,
        interestRateId: null,
        cancleAfterVerifyDay: null,
        prePaymentFlag: '',
        preFeeCalCompt: '',
        preFeeRate: null,
        preFeeAmt: null,
        overdueFlag: '',
        overdueCalCompt: '',
        overdueRateId: null,
        lateFeeFlag: '',
        lateCalCompt: '',
        lateFeeId: null,
        contractCode: '',
        lastLoanOverdueDays: null,
        createUser: 'admin',
        updateUser: 'admin',
        feeList: []
      },
      //开始时间只能选当前时间之后
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      //表单校验规则
      rules: {
        term: [{ required: true, message: 'please select', trigger: 'change' }],
        minAmt: [{ required: true, message: 'please enter', trigger: 'blur' }],
        maxAmt: [{ required: true, message: 'please enter', trigger: 'blur' }],
        interestRateId: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        overdueFlag: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        overdueCalCompt: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        overdueRateId: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        fromChannel: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        status: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        productName: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        enableDiscount: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        enableCoupon: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        revocableDays: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: 'please select', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: 'please select', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        productIntroduction: [
          { required: false, message: 'please enter', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: 'Within 100 characters',
            trigger: 'blur'
          }
        ],
        productLable: [
          { required: false, message: 'please enter', trigger: 'blur' }
        ],
        contractCode: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        userLabel: [
          { required: false, message: 'please select', trigger: 'change' }
        ],
        productFeeId: [
          { required: true, message: 'please enter', trigger: 'blur' },
          { min: 1, message: 'Can not be empty', trigger: 'blur' }
        ],
        cancleAfterVerifyDay: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ],
        prePaymentFlag: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        preFeeCalCompt: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        preFeeRate: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ],
        preFeeAmt: [
          {
            required: true,
            type: 'number',
            message: 'please enter',
            trigger: 'blur'
          }
        ],
        lateFeeFlag: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        lateCalCompt: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        lateFeeId: [
          { required: true, message: 'please select', trigger: 'change' }
        ]
      },
      feeList: {
        feeType: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        feeCollMethod: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        feeCalCompt: [
          { required: true, message: 'please select', trigger: 'change' }
        ],
        feeRate: [
          {
            required: true,
            message: 'Not support blank, please check data',
            trigger: 'blur'
          }
        ],
        feeAmt: [
          {
            required: true,
            message:
              'The amount must be number, 6 bits after the decimal point.',
            trigger: 'blur'
          }
        ],
        minAmt: [
          {
            required: true,
            message:
              'The amount must be number, 6 bits after the decimal point.',
            trigger: 'blur'
          }
        ],
        maxAmt: [
          {
            required: true,
            message:
              'The amount must be number, 6 bits after the decimal point.',
            trigger: 'blur'
          }
        ]
      },
      //枚举值
      queryInterestList: [],
      //判断弹窗是新增，还是修改
      dialogType: 'add',
      //合同模板
      contractTemplatesList: [],
      productQueryProductFeeRelEnumList: [],
      feeTypeList: [],
      lateFeesList: [],
      overDuesList: []
    }
  },
  computed: {
    ...mapGetters(['sidebar'])
  },
  watch: {},
  mounted() {
    this.getBasiData()
  },
  methods: {
    dialogClose() {
      this.dialogFormVisible = false
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    addFormItem() {
      this.form.feeList.push({
        feeType: '',
        feeCollMethod: '',
        feeCalcMethod: '',
        feeCalCompt: '',
        feeRate: null,
        feeAmt: null,
        minAmt: '',
        maxAmt: ''
      })
    },
    removeFormItem(item) {
      var index = this.form.feeList.indexOf(item)
      if (index !== -1) {
        this.form.feeList.splice(index, 1)
      }
    },
    //查询基本信息
    getBasiData() {
      let _this = this
      let data = {
        data: {
          productId: _this.$route.query.productId
        }
      }
      productFeeForm(data)
        .then((res) => {
          _this.contractTemplatesList = res.data.contractTemplates
          _this.queryInterestList = res.data.interest
          _this.lateFeesList = res.data.lateFees
          _this.overDuesList = res.data.overDues
        })
        .catch((e) => {
          console.log('error')
        })
      productQueryProduct(data)
        .then((res) => {
          _this.detailsForm = res.data.product
          _this.tableData = res.data.productFees
          if (this.$route.query.productFeeId) {
            if (res.data.productFees.length > 0) {
              let obj = {}
              res.data.productFees.forEach((item) => {
                if (item.productFeeId === this.$route.query.productFeeId) {
                  obj = item
                }
              })
              if (obj && obj.productFeeId) {
                this.mdfRow(obj)
              }
            }
          }
        })
        .catch((e) => {
          console.log('error')
        })
      //查询产品相关枚举类型类型
      productQueryProductRelEnum()
        .then((res) => {
          //处理成数组
          var arr = []
          let getObj = res.data.calCompt
          _this.feeTypeList = res.data.feeType
          for (let i in getObj) {
            let o = {}
            o[i] = getObj[i]
            arr.push(o)
          }
          _this.productQueryProductFeeRelEnumList = arr
          for (
            var i = 0;
            i < _this.productQueryProductFeeRelEnumList.length;
            i++
          ) {
            if (_this.productQueryProductFeeRelEnumList[i].AP) {
              _this.productQueryProductFeeRelEnumList[i].AP = 'Full principal'
            } else if (_this.productQueryProductFeeRelEnumList[i].OP) {
              _this.productQueryProductFeeRelEnumList[i].OP =
                'Overdue principal'
            } else if (_this.productQueryProductFeeRelEnumList[i].SP) {
              _this.productQueryProductFeeRelEnumList[i].SP =
                'Residual principal'
            } else if (_this.productQueryProductFeeRelEnumList[i].AR) {
              _this.productQueryProductFeeRelEnumList[i].AR = 'All repayment'
            }
          }
        })
        .catch((e) => {
          console.log('error')
        })
    },
    AddItem: function () {
      this.form.productId = this.$route.query.productId
      this.dialogType = 'add'
      this.form = this.$options.data().form
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.dialogFormVisible = true
    },
    deleteRow: function (row) {
      console.log(row)
      let _this = this
      let data = {
        data: {
          productFeeId: row.productFeeId,
          productId: row.productId
        }
      }
      _this
        .$confirm('Confirm deletion of this product?', 'Prompt', {
          confirmButtonText: 'Comfirm',
          cancelButtonText: 'Close',
          type: 'warning'
        })
        .then(() => {
          productFeeDelete(data)
            .then((res) => {
              _this.$message({
                type: 'success',
                message: 'successfully deleted!'
              })
              _this.getBasiData()
            })
            .catch((e) => {
              console.log('error')
            })
        })
        .catch(() => {
          _this.$message({
            type: 'info',
            message: 'Canceled'
          })
        })
    },
    mdfRow(row) {
      console.log(row)
      let newData = JSON.parse(JSON.stringify(row))
      this.dialogType = 'modify'
      if (newData.feeList == null) {
        newData.feeList = []
        this.form = newData
      } else {
        this.form = newData
      }
      this.dialogFormVisible = true
    },
    mdfConfirm(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.productId = _this.$route.query.productId
          let data = {
            data: _this.form
          }
          productFeeUpdate(data)
            .then((res) => {
              _this.dialogFormVisible = false
              //添加成功，刷新列表
              _this.getBasiData()
            })
            .catch((e) => {
              _this.dialogFormVisible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //添加冲销详情配置
    comfirmAdd(formName) {
      let _this = this
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.form.productId = _this.$route.query.productId
          let data = {
            data: _this.form
          }
          productAddDetail(data)
            .then((res) => {
              _this.dialogFormVisible = false
              //添加成功，刷新列表
              _this.getBasiData()
            })
            .catch((e) => {
              //_this.dialogFormVisible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.stagedPenalty {
  margin: 10px 0;
  display: table;
  border-collapse: collapse;
  width: 100%;
  padding: 10px 0;
  border-spacing: 5px 1px;
  h4 {
    font-weight: 700;
    color: #000;
    margin-bottom: 10px;
    display: block;
  }
  .addBtn {
    margin-bottom: 10px;
  }
  .formListItem {
    display: table-row;
    line-height: 40px;
    div {
      display: table-cell;
      &.el-form-item {
        border: 1px solid #ccc;
        /deep/ .el-input__inner {
          margin: 0;
          height: 34px;
        }
        /deep/ .el-form-item__content {
          margin-left: 0 !important;
          padding-left: 10px;
          padding-right: 10px;
          button {
            border: none;
            margin-left: -10px;
          }
        }
      }
    }
  }
}
</style>
