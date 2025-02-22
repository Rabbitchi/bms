<template>
  <div class="container">
    <el-button
      type="primary"
      size="small"
      @click="addBanner"
      :style="{ 'margin-bottom': '20px' }"
    >
      新增
    </el-button>
    <tableTemplate
      ref="SearchTable"
      :config="tableConfig"
      :tableData="tableData"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <template slot="logo" slot-scope="scope">
        <img
          :src="scope.row.img_url"
          alt=""
          :style="{ height: '50px', width: '50px' }"
        />
      </template>
      <template slot="status" slot-scope="scope">
        <span
          :style="{ color: scope.row.status === 1 ? '#67C23A' : '#F56C6C' }"
        >
          {{ scope.row.status | formatStatus }}
        </span>
      </template>
      <template slot="operation" slot-scope="scope">
        <span
          @click="operateShelf(scope.row)"
          :style="{ cursor: 'pointer' }"
          class="operate-btn"
        >
          {{ scope.row.status === 1 ? '下' : '上' }}架
        </span>
        <span
          @click="editItem(scope.row)"
          :style="{ cursor: 'pointer', 'margin-left': '10px' }"
          class="operate-btn"
        >
          编辑
        </span>
      </template>
    </tableTemplate>
  </div>
</template>

<script>
import tableTemplate from '@/components/manage/tableTemplate.vue'
import { getBannerList, publishBanner } from '@/api/manage/operatingManage'
export default {
  name: 'BannerList',
  components: { tableTemplate },
  data() {
    return {
      tableConfig: {
        defaultSort: { prop: 'infoId', order: 'descending' },
        thead: [
          {
            label: '名称',
            prop: 'banner_name',
            align: 'center'
          },
          {
            label: '发布渠道',
            prop: 'publish_channels_display',
            align: 'center'
          },
          {
            label: '缩略图',
            prop: 'img_url',
            align: 'center',
            type: 'slot',
            slotName: 'logo'
          },
          {
            label: '展示顺序',
            prop: 'weight',
            align: 'center'
            // sortable: 'custom',
          },
          {
            label: '备注',
            prop: 'remark',
            align: 'center'
          },
          {
            label: '跳转链接',
            prop: 'action_data',
            align: 'center'
          },
          {
            label: '创建人',
            prop: 'creator_name',
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time_fmt',
            align: 'center'
          },
          {
            label: '最后更新人',
            prop: 'editor_name',
            align: 'center'
          },
          {
            label: '最后更新时间',
            prop: 'update_time_fmt',
            align: 'center'
          },
          {
            label: '状态',
            prop: 'status',
            align: 'center',
            type: 'slot',
            slotName: 'status'
          },
          {
            label: '操作',
            type: 'slot',
            slotName: 'operation',
            align: 'center'
          }
        ],
        url: '/ls-mgr-api/opr-mgr/banner/list',
        pagination_config: {
          isShow: true,
          total: 0,
          page_size: 10,
          page_index: 1
        }
      },
      tableData: []
    }
  },
  mounted() {
    this.queryBannerList()
  },
  methods: {
    // banner列表
    queryBannerList() {
      let data = {
        data: {
          page_size: this.tableConfig.pagination_config.page_size,
          page_index: this.tableConfig.pagination_config.page_index - 1
        }
      }
      this.loading = true
      getBannerList(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            let { data } = res
            this.tableConfig.pagination_config.total = data.total || 0
            this.tableConfig.pagination_config.isShow = data.total > 0
            this.tableData = data.banners || []
            this.tableData.map((el) => {
              el.action_data =
                el.action_type === 'API_VIEW'
                  ? el.action_data.split(',')[1]
                  : el.action_data
            })
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 点击新增
    addBanner() {
      this.$router.push({
        path: 'operationBanner',
        query: { type: 'create' }
      })
    },
    // 操作上/下架
    operateShelf(row) {
      let data = {
        data: {
          banner_id: row.banner_id,
          status: row.status === 1 ? 2 : 1
        }
      }
      publishBanner(data)
        .then((res) => {
          if (res.status && res.status.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.queryBannerList()
          }
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    // 编辑
    editItem(row) {
      this.$router.push({
        path: 'operationBanner',
        query: { bannerId: row.banner_id }
      })
    },
    handleCurrentChange(val) {
      this.tableConfig.pagination_config.page_index = val
      this.queryBannerList()
    },
    handleSizeChange(val) {
      this.tableConfig.pagination_config.page_size = val
      this.queryBannerList()
    }
  }
}
</script>
<style lang="scss" scoped>
.operate-btn {
  &:hover {
    color: #409eff;
  }
}

::v-deep .el-table .cell.el-tooltip {
  white-space: initial;
}
</style>

<style lang="scss" scoped></style>
