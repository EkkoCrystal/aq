<template>
  <div class="dashboard-editor-container">
    <!-- head -->

    <el-row style="margin: 20px 0;">
      <el-col :span="24">
        <div class="leftNum" style="height:50px;padding: 5px 0;">
          <el-date-picker
            v-model="formTable.day"
            type="date"
            class="search-item"
            :clearable="false"
            placeholder="选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="changeDay" />
        </div>
      </el-col>

    </el-row>
    <el-row style="margin: 20px 0;">
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">现有阳性</span>
          <span v-if="totalObj.totalPosCount !== null" class="oneNum">{{ totalObj.totalPosCount }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">新增阳性</span>
          <span v-if="totalObj.posCount !== null" class="twoNum">{{ totalObj.posCount }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="leftNum">
          <span class="titleNum">当日检测</span>
          <span v-if="totalObj.testCount !== null" class="threeNum">{{ totalObj.testCount }}</span>
        </div>
      </el-col>
    </el-row>
    <el-card class="box-card">
      <div slot="header" style="text-align: center">
        <div style="font-size:16px;font-weight: bold;">检测人员分布</div>
      </div>
      <el-row v-for="(item, index) in totalObjSummary" :key="index">
        <el-col v-for="(itemobj, indexobj) in item" :key="indexobj" :span="8">
          <div class="leftNum">
            <span v-if="itemobj.personTypeDisplay !== null" class="titleNum">{{ itemobj.personTypeDisplay }}</span>
            <span v-if="itemobj.count !== null" class="fourNum">{{ itemobj.count }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- barline -->
    <el-card class="tableTT">
      <div slot="header" style="text-align: center">
        <div style="font-size:16px;font-weight: bold;">各机构检测人员分布（
          <span style="color:red;">阳性</span>/
          <span style="color:#10ADB6;">检测人员</span>）
        </div>
      </div>
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          border
          highlight-current-row
          show-summary
          :summary-method="getSummaries"
          :header-cell-style="{ background: '#F0F3F5', color: '#303843' }">
          <el-table-column
            prop="name"
            label="机构"
            fixed
            min-width="170"
            align="center" />
          <el-table-column
            v-for="(item,index) in titleArr"
            :key="index"
            :prop="item.personType"
            :label="item.personTypeDisplay"
            min-width="140"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.personTypeSummaries[index].posCount }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.personTypeSummaries[index].count }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="personCount"
            label="统计"
            min-width="140"
            align="center">
            <template slot-scope="scope">
              <span style="color:#E93132;">{{ scope.row.posCount }}&nbsp;</span>
              <span>/</span>
              <span style="color:#10ADB6;">&nbsp;{{ scope.row.personCount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin:5px;float:right">
        <el-pagination
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size.sync="formTable.size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </el-card>
  </div>
</template>

<script>
// import LineChart from './components/LineChart'
// import MapChart from './components/MapChart'
// import BarChart from './components/BarChart.vue'
import { getTotalCount, getOrganizationSummary, getTotalPersonSummary } from '@/api/user'
import moment from 'moment'
import { mapGetters } from 'vuex'
// import china from '@/views/dashboard/json/china.json'
// import hangzhou from '@/views/dashboard/json/province/hangzhou.json'
// import tongweixian from '@/views/dashboard/json/province/tongweixian.json'

import { Message } from 'element-ui'
// import '../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
export default {
  components: {

  },
  data () {
    return {
      totalObj: {
        totalPosCount: '',
        posCount: '',
        testCount: ''
      },
      totalObjSummary: [],
      titleArr: [],
      // totalObjSummary: {
      //   homeQuarantine: '',
      //   homeHealthMonitoring: '', // 居家健康监测
      //   medicalStaff: '',
      //   inpatient: '',
      //   accompany: '',
      //   outpatient: '',
      //   selfCheck: '',
      //   other: ''

      // },
      form: {
        day: moment().format('YYYY-MM-DD'),
        tenant: '',
        size: 20,
        page: 1
      },
      loading: false,
      myIcon: null,
      tabPosition: 'right',
      trendDay: 7,
      lineChartData: {},
      areaData: [],
      totalAreaSumData: {},
      dayAreaSumData: {},
      ffheight: '',
      tableData: [],
      formTable: {
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
  mounted () {
    this.onSearch()
  },
  created () {
    this.initData()
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      console.log(param)
      console.log('111111111111111')
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        let values = []
        let values1 = []
        if (index === columns.length - 1) {
          values = data.map(item => Number(item[column.property]))
          values1 = data.map(item => Number(item['posCount']))
        } else {
          values = data.map(item => Number(item['personTypeSummaries'][index - 1]['posCount']))
          values1 = data.map(item => Number(item['personTypeSummaries'][index - 1]['count']))
        }
        if (!values.every(value => isNaN(value)) && !values1.every(value => isNaN(value))) {
          const num1 = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          const num2 = values1.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = (() => {
            const num = <div>
              <span style='color:#E93132;'>{num1}&nbsp;</span>
              <span>/</span>
              <span style='color:#10ADB6;'>&nbsp;{num2}</span>
            </div>
            return num
          })()
        } else {
          sums[index] = ' '
        }
      })
      console.log(sums)
      return sums
    },
    initData () {
      this.formTable.tenant = this.organizationName
      getTotalCount(this.formTable).then(res => {
        console.log(res)
        console.log('qqqqqqqqqqqqqqq')
        if (res.dataContent !== null) {
          this.totalObj = res.dataContent
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      //
      this.totalObjSummary = []
      getTotalPersonSummary(this.formTable).then(res => {
        console.log(res)
        console.log('rrrrrrrrrrrrrrrrrrrr')
        if (res.dataContent !== null) {
          const arr = res.dataContent
          const a = Math.ceil(arr.length / 3)
          for (let index = 0; index < a; index++) {
            const aa = arr.filter((value, indexx) => {
              return indexx < (index + 1) * 3 && indexx >= index * 3
            })
            this.totalObjSummary.push(aa)
          }
        }
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
      this.onSearch()
    },
    changeDay (val) {
      this.cleanAllData()
      this.initData()
    },
    cleanAllData () {
      this.totalObj = {
        totalPosCount: '',
        posCount: '',
        testCount: ''
      }
      this.totalObjSummary = []
      this.tableData = []
    },
    // 表格数据
    onSearch () {
      this.formTable.page = 1
      this.query()
    },
    query () {
      this.formTable.tenant = this.organizationName
      this.loading = true
      console.log(this.formTable)
      getOrganizationSummary(this.formTable).then(res => {
        console.log(res)
        console.log('22222222222222222222222')
        if (res.dataContent.records !== null) {
          const cc = res.dataContent.records
          cc.forEach((element, index) => {
            if (index === 0 && element.personTypeSummaries !== null) {
              this.titleArr = element.personTypeSummaries
            }
          })
        }
        this.tableData = res.dataContent.records
        this.total = res.dataContent.total
        this.loading = false
      }).catch(err => {
        Message.error(err.message)
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.formTable.size = val
      this.query()
    },
    handleCurrentChange (val) {
      this.formTable.page = val
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
.leftNum {
  height: 80px;
  text-align: center;
  background-color: white;
  padding: 15px 0;
  span {
    display: block;
    width: 100%;
    height: 30px;
  }
  .titleNum {
    color: #333333;
    font-size: 16px;
  }
  .oneNum {
    color: #E93132;
    font-size: 20px;
  }
  .twoNum {
    color: #FF6956;
    font-size: 20px;
  }
  .threeNum {
    color: #476DA0;
    font-size: 20px;
  }
  .fourNum {
    color: #10ADB6;
    font-size: 20px;
  }
  .count_row {
    color: red;
  }
}
</style>
