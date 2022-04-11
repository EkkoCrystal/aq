<template>
  <div>
    <el-card>
      <el-form
        ref="formm"
        :model="form"
        :inline="true"
        class="txt"
        label-width="120px"
        size="small">
        <el-row>
          <el-col>
            <el-form-item label="关键词:">
              <el-input
                v-model="form.condition"
                class="search-item"
                clearable
                placeholder="请输入姓名或手机号" />
            </el-form-item>
            <el-form-item label="省/市/区:" prop="valueData">
              <el-cascader
                ref="cityCasc"
                v-model="form.valueData"
                :props="props"
                filterable
                clearable
                @change="handleMyCityChange" />
            </el-form-item>
            <el-form-item label="组织机构:">
              <el-select
                v-model="form.organizationId"
                clearable
                placeholder="请选择">
                <el-option
                  v-for="item in organizations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="检测结果:">
              <el-select
                v-model="form.value"
                placeholder="请选择">
                <el-option
                  v-for="item in results"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="beginDate" label="开始日期:">
              <el-date-picker
                v-model="form.beginDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" />
            </el-form-item>
            <el-form-item prop="endDate" label="结束日期:">
              <el-date-picker
                v-model="form.endDate"
                type="date"
                class="search-item"
                placeholder="选择日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="人员类型:">
              <el-select
                v-model="form.personType"
                placeholder="请选择">
                <el-option
                  v-for="item in perTypes"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <div style="margin-left: 48px;">
                <el-button
                  type="primary"
                  @click="onSearch">查询</el-button>
                <el-button
                  type="primary"
                  @click="exportHandle">导出</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
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
            label="组织机构"
            min-width="140"
            align="center" />
          <el-table-column
            prop="name"
            label="姓名"
            min-width="70"
            align="center" />
          <el-table-column
            prop="genderDisplay"
            label="姓别"
            min-width="70"
            align="center" />
          <el-table-column
            prop="personTypeDisplay"
            label="人员类型"
            min-width="130"
            align="center" />
          <el-table-column
            prop="identityCode"
            label="身份证号"
            min-width="120"
            align="center" />
          <el-table-column
            prop="address"
            label="籍贯地址"
            min-width="120"
            :formatter="censusAddressMatter"
            align="center" />
          <el-table-column
            prop="phoneNumber"
            label="联系方式"
            min-width="100"
            align="center" />
          <el-table-column
            prop="resultDisplay"
            label="最新检测结果"
            min-width="90"
            align="center">
            <template slot-scope="scope">
              <div>
                <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleEdit(scope.row.stripPath)">{{ scope.row.resultDisplay }}
                </el-button>
                <i v-if="scope.row.result !== null" class="el-icon-picture" style="color:rgba(24, 144, 255, 1)" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="testTime"
            label="检测时间"
            min-width="120"
            :formatter="timeForMatter"
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
import { mapGetters } from 'vuex'
import { getAffectedRecords, getPersonTypes,
  getAreasRoot, getAreasSub, getOrganizationsOne } from '@/api/user'
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
      dd: true,
      tableData: [],
      counties: [],
      streets: [],
      loading: false,
      codeUrl: null,
      codeDialogVisible: false,
      form: {
        valueData: [],
        condition: '',
        province: '',
        city: '',
        county: '',
        value: '',
        tenant: '',
        organizationId: '',
        beginDate: '',
        endDate: '',
        personType: '',
        size: 20,
        page: 1
      },
      results: [
        {
          value: '',
          name: '所有'
        },
        {
          value: 'Neg',
          name: '阴性'
        },
        {
          value: 'Pos',
          name: '阳性'
        }
      ],
      organizations: [],
      perTypes: [],
      pageSize: 30,
      exportTableData: [],
      total: 0,
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const { level } = node
          if (level === 0) {
            getAreasRoot().then(res => {
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 2 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              }
            }).catch(err => {
              Message.error(err.message)
            })
          } else {
            getAreasSub(node.value).then(res => {
              // 处理数据this.handleCity()
              const arrArr = res.dataContent
              if (arrArr !== null && arrArr !== undefined && arrArr.length >= 0) {
                const arr = arrArr.map((e) => ({ value: e.id, label: e.name, leaf: level >= 2 }))
                resolve(arr) // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              }
            }).catch(err => {
              Message.error(err.message)
            })
          }
        }
      }
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
    isValidDateArea () {
      if (this.form.beginDate !== null && this.form.beginDate.length > 0 &&
        this.form.endDate !== null && this.form.endDate.length > 0) {
        return moment(this.form.beginDate).isSameOrBefore(this.form.endDate)
      } else {
        return true
      }
    },
    censusAddressMatter (row) {
      if (row.address !== null) {
        return this.testString(row.address.province) +
        this.testString(row.address.city) +
        this.testString(row.address.county) +
        this.testString(row.address.address)
      }
    },
    testString (str) {
      return str !== null ? str : ''
    },
    timeForMatter (row) {
      return row.testTime !== null ? moment(row.testTime).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    initOptions () {
      const obj = {
        tenantCode: this.organizationName
      }
      getOrganizationsOne(obj).then(res => {
        if (res.dataContent !== null) {
          this.organizations = res.dataContent.records
        }
      }).catch(err => {
        Message.error(err.message)
      })
      getPersonTypes().then(res => {
        console.log(res)
        console.log('wwwwwwwwwwwwwwwwwww')
        if (res.dataContent !== null) {
          this.perTypes = res.dataContent
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    handleMyCityChange (node) {
      const nodeArr = this.$refs.cityCasc.getCheckedNodes()
      this.form.province = ''
      this.form.city = ''
      this.form.county = ''
      console.log(nodeArr)
      if (nodeArr && nodeArr.length > 0) {
        const nodeObjArr = nodeArr[0].pathLabels
        if (nodeObjArr.length === 1) {
          this.form.province = nodeObjArr[0]
        } else if (nodeObjArr.length === 2) {
          this.form.province = nodeObjArr[0]
          this.form.city = nodeObjArr[1]
        } else if (nodeObjArr.length === 3) {
          this.form.province = nodeObjArr[0]
          this.form.city = nodeObjArr[1]
          this.form.county = nodeObjArr[2]
        }
      }
    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      console.log(this.form)
      if (this.isValidDateArea()) {
        this.form.tenant = this.organizationName
        this.loading = true
        getAffectedRecords(this.form).then(res => {
          console.log(res)
          this.tableData = res.dataContent.records
          this.total = res.dataContent.total
          this.loading = false
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
      } else {
        Message.error('开始日期必须小于结束日期')
      }
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
        query: { id: row.person.userId, isUser: 'false' }
      })
    },
    handleEdit (url) {
      console.log(url)
      this.codeUrl = url
      this.codeDialogVisible = true
    },
    exportHandle () {
      this.exportTableData = []
      const tHeader = ['姓名', '性别', '身份证号', '联系方式', '最新结果', '检测时间', '检测地点']
      const filterVal = ['name', 'genderDisplay', 'identityCode', 'phoneNumber', 'resultDisplay', 'testTime', 'censusAddress']
      const list = []
      const listData = []
      var pageCount = Math.ceil(this.total / this.pageSize)
      for (let index = 1; index < pageCount + 1; index++) {
        getAffectedRecords({
          condition: this.form.condition,
          province: this.form.province,
          city: this.form.city,
          county: this.form.county,
          value: this.form.value,
          tenant: this.form.tenant,
          page: index,
          size: this.pageSize
        }).then(res => {
          res.dataContent.records.forEach(item => {
            list.push(item)
          })
          if (list.length === this.total) {
            list.forEach(element => {
              const obj = {}
              obj.name = element.name
              obj.genderDisplay = element.genderDisplay
              obj.identityCode = element.identityCode
              obj.phoneNumber = element.phoneNumber
              obj.resultDisplay = element.resultDisplay
              obj.testTime = moment(element.testTime).format('YYYY-MM-DD HH:mm:ss')
              obj.censusAddress = this.censusAddressMatter(element)
              listData.push(obj)
            })
            const data = this.formatJson(filterVal, listData)
            import('@/vendor/Export2Excel').then(excel => {
              excel.export_json_to_excel({
                header: tHeader, // 表头 必填
                data, // 具体数据 必填
                filename: 'excel-list', // 非必填
                autoWidth: true, // 非必填
                bookType: 'xlsx' // 非必填
              })
            }).catch(e => {})
          }
        }).catch(err => {
          Message.error(err.message)
          this.loading = false
        })
      }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
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
.txt /deep/ .el-input__inner {
  width: 220px !important;
}
</style>
