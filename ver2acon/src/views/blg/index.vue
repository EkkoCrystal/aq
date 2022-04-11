<template>
  <div>
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        size="small">
        <!-- <el-form-item label="关键词:">
          <el-input
            v-model="form.condition"
            class="search-item"
            placeholder="请输入姓名或手机号" />
        </el-form-item> -->
        <el-form-item label="日期:">
          <el-date-picker
            v-model="form.day"
            type="date"
            class="search-item"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column
            label="序号"
            type="index"
            width="50"
            align="center" />
          <el-table-column
            prop="day"
            label="日期"
            min-width="100"
            :formatter="timeForMatter"
            align="center" />
          <el-table-column
            prop="code"
            label="组织机构编码"
            min-width="100"
            align="center" />
          <el-table-column
            prop="name"
            label="组织机构名称"
            min-width="120"
            align="center" />
          <el-table-column
            prop="personCount"
            label="检测总人数"
            min-width="100"
            align="center" />
          <el-table-column
            prop="posCount"
            label="阳性人数"
            min-width="100"
            align="center" />
          <el-table-column
            align="center"
            label="操作"
            min-width="100">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleDetail(scope.row)">统计详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size.sync="form.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOrganizationSummary } from '@/api/user'
import { Message } from 'element-ui'
// import vueQr from 'vue-qr'
import moment from 'moment'
// import MyTreeselect from '@/components/common/MyTreeselect.vue'

export default {
  // components: {
  //   MyTreeselect
  // },
  data () {
    return {
      tableData: [],
      loading: false,
      form: {
        day: moment().format('YYYY-MM-DD'),
        tenant: '',
        size: 20,
        page: 1
      },
      total: 0
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'organizationName'])

  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    timeForMatter (row) {
      return row.day !== null ? moment(row.day).format('YYYY-MM-DD') : ''
    },
    initOptions () {

    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.form.tenant = this.organizationName
      this.loading = true
      getOrganizationSummary(this.form).then(res => {
        console.log(res)
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.form.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.form.page = val
      this.query()
    },
    handleDetail (row) {
      console.log(row)
      this.$router.push({
        path: '/blg/operatorblg',
        query: { organizationId: row.organizationId, name: row.name }
      })
    }
  }
}
</script>

<style scoped>

</style>
