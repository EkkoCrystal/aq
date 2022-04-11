<template>
  <div>
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        size="small">
        <el-form-item label="关键词:">
          <el-input
            v-model="form.condition"
            class="search-item"
            placeholder="请输入姓名或手机号" />
        </el-form-item>
        <!-- <el-form-item label="浙江省/杭州市:">
          <el-select
            v-model="form.county"
            placeholder="请选择区"
            @change="handleMyCityChange">
            <el-option
              v-for="item in counties"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>

        </el-form-item>
        <el-form-item label="街道:">
          <el-select
            v-model="form.subdistrict"
            placeholder="请选择街道"
            class="edit-form-item">
            <el-option
              v-for="item in streets"
              :key="item.id"
              :label="item.name"
              :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button
            type="primary"
            @click="onSearch">查询
          </el-button>
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
            prop="organizationName"
            label="组织机构名称"
            min-width="120"
            align="center" />
          <el-table-column
            prop="nickName"
            label="姓名"
            min-width="70"
            align="center" />
          <el-table-column
            prop="genderDisplay"
            label="姓别"
            min-width="70"
            align="center" />
          <el-table-column
            prop="idCard"
            label="身份证号"
            min-width="120"
            align="center" />
          <el-table-column
            prop="phoneNumber"
            label="联系方式"
            min-width="100"
            align="center" />
          <el-table-column
            prop="censusAddress"
            label="户籍地址"
            min-width="120"
            :formatter="censusAddressMatter"
            align="center" />
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
    <el-dialog
      :close-on-click-modal="false"
      title="检测结果"
      :visible.sync="codeDialogVisible"
      width="300px">
      <el-card>
        <el-image
          v-if="codeUrl !== null"
          :src="codeUrl"
          fit="fill">
          <div
            slot="placeholder"
            class="image-slot">
            加载中<span class="dot">...</span>
          </div>
          <div
            slot="error"
            class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
        <div v-else>暂没有信息</div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>

import { getUsers

} from '@/api/user'
import { Message } from 'element-ui'
// import vueQr from 'vue-qr'
import moment from 'moment'

export default {
  // components: {
  //   vueQr
  // },
  data () {
    return {
      tableData: [],
      counties: [],
      streets: [],
      loading: false,
      codeUrl: '',
      codeDialogVisible: false,
      form: {
        condition: '',
        size: 20,
        page: 1
      },

      total: 0
    }
  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    formatterTime (val) {
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    },
    addressMatter (row) {
      if (row.address !== null) {
        return this.testString(row.address.province) +
        this.testString(row.address.city) +
        this.testString(row.address.county) +
        this.testString(row.address.subdistrict) +
        this.testString(row.address.address)
      }
    },
    censusAddressMatter (row) {
      if (row.censusAddress !== null) {
        return this.testString(row.censusAddress.province) +
        this.testString(row.censusAddress.city) +
        this.testString(row.censusAddress.county) +
        this.testString(row.censusAddress.subdistrict) +
        this.testString(row.censusAddress.address)
      }
    },
    testString (str) {
      return str !== null ? str : ''
    },
    initOptions () {

    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getUsers(this.form).then(res => {
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
      this.$router.push({
        path: '/user/detail',
        query: { id: row.userId, isUser: 'true' }
      })
    },
    handleEdit (url) {
      this.codeUrl = url
      this.codeDialogVisible = true
    }
  }
}
</script>

<style scoped>
.main {
  margin: 10px;
}
.el-formitemClass {
  margin-bottom: 1px;
}
.mmnn /deep/ .myDialogClass .el-dialog .el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
