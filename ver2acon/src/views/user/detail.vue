<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" style="margin: 30px">
      <div slot="header">
        <span>用户信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="backHandle">返回</el-button>
      </div>
      <div>
        <el-form
          ref="usergg"
          style="width:100%;height:300px;padding:20px;"
          :model="user"
          size="mini"
          label-width="90px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item
                label="姓名:">
                <span v-if="user.nickName !== null">{{ user.nickName }}</span>
              </el-form-item>
              <el-form-item
                label="性别:">
                <span v-if="user.genderDisplay !== null">{{ user.genderDisplay }}</span>
              </el-form-item>
              <!-- <el-form-item
                label="出生日期:">
                <span v-if="user.genderDisplay !== null">{{ "userObj.gender" }}</span>
              </el-form-item> -->
              <el-form-item
                label="身份证号:">
                <span v-if="user.idCard !== null">{{ user.idCard }}</span>
              </el-form-item>
              <el-form-item
                label="联系方式:">
                <span v-if="user.phoneNumber !== null">{{ user.phoneNumber }}</span>
              </el-form-item>
              <el-form-item
                label="现住址:">
                <span v-if="user.address !== null">{{ addressMatter(user.address) }}</span>
              </el-form-item>
              <el-form-item
                label="籍贯:">
                <span v-if="user.censusAddress !== null">{{ addressMatter(user.censusAddress) }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card v-if="!isUser">
      <div>
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column
            prop="creationTime"
            label="自测时间"
            min-width="100"
            align="center" />
          <el-table-column
            prop="resultDisplay"
            label="最新结果"
            min-width="70"
            align="center" />
          <el-table-column
            prop="addressDisplay"
            label="测试地点"
            min-width="130"
            align="center" />
          <el-table-column
            align="center"
            label="查看"
            min-width="100">
            <template slot-scope="scope">
              <div v-if="scope.row.stripPath !== null">
                <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleEdit(scope.row.stripPath)">查看
                </el-button>
                <i class="el-icon-picture" style="color:rgba(24, 144, 255, 1)" />
              </div>
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

import { getUsersDetail, getUsersRecords

} from '@/api/user'
import { Message } from 'element-ui'
// import moment from 'moment'

export default {
  name: 'Detail',
  data () {
    return {
      tableData: [],
      loading: false,
      form: {
        userId: '',
        size: 20,
        page: 1
      },
      user: {},
      codeDialogVisible: false,
      codeUrl: '',
      total: 0
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    },
    isUser () {
      return this.$route.query.isUser === 'true'
    }
  },
  created () {
    this.initOptions()
  },
  mounted () {
    this.onSearch()
  },
  methods: {
    addressMatter (row) {
      if (row !== null && row !== undefined) {
        return this.testString(row.province) +
        this.testString(row.city) +
        this.testString(row.county) +
        this.testString(row.subdistrict) +
        this.testString(row.address)
      }
    },
    testString (str) {
      return str !== null ? str : ''
    },
    initOptions () {
      if (this.id === undefined) {
        this.$router.push({
          path: '/index'
        })
        return
      }
      this.form.userId = this.id
      this.loading = true
      getUsersDetail(this.id).then(res => {
        console.log(res)
        this.user = res.dataContent
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.loading = true
      getUsersRecords(this.form).then(res => {
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
    backHandle () {
      this.$router.go(-1)
    },
    handleEdit (url) {
      console.log(url)
      console.log('11111111111111111111111')
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
