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
            placeholder="请输入" />
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button
            type="primary"
            @click="onSearch">查询</el-button> -->
          <el-button
            type="primary"
            size="small"
            @click="handleNewOrganization">新增组织机构</el-button>
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
            prop="code"
            label="组织机构编码"
            min-width="90"
            align="center">
            <template slot-scope="scope">
              <el-link type="primary" @click="clickEQ(scope.row)">{{ scope.row.code }}</el-link>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="组织机构名称"
            min-width="120"
            align="center" />
          <el-table-column
            prop="contactName"
            label="负责人"
            min-width="90"
            align="center" />
          <el-table-column
            prop="contactPhoneNumber"
            label="负责人手机号"
            min-width="90"
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
                @click="handlePre(scope.row)">查看操作人
              </el-button>
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleEdit(scope.row)">编辑
              </el-button>
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleResetPassword(scope.row)">修改密码
              </el-button>
              <el-button
                size="mini"
                type="text"
                style="color:#1890FF"
                @click="handleDelete(scope.row)">删除
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
    <!-- 新增组织机构 -->
    <div class="kk">
      <el-dialog
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="520px"
        @close="closedDialog">
        <span slot="title">
          <span v-if="!organization.isEdit">新增组织机构</span>
          <span v-else>编辑组织机构</span>
        </span>
        <el-card class="box-card" shadow="never">
          <el-form
            ref="organizationForm"
            style="width: 100%"
            :rules="organizationRules"
            :model="organization"
            size="mini"
            label-width="120px">

            <el-form-item label="组织机构编码:" prop="code">
              <el-input v-model="organization.code" oninput="value=value.replace(/\D|^0/g,'')" type="tel" />
            </el-form-item>
            <el-form-item label="组织机构名称:" prop="name">
              <el-input v-model="organization.name" />
            </el-form-item>
            <el-form-item label="负责人:" prop="contactName">
              <el-input v-model="organization.contactName" />
            </el-form-item>
            <el-form-item label="负责人手机号:" prop="contactPhoneNumber">
              <el-input v-model="organization.contactPhoneNumber" />
            </el-form-item>
          </el-form>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            plain
            type="primary"
            @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            size="small"
            :loading="addHandle"
            @click="handleSave">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog
      :visible.sync="passwordDialogVisible"
      :close-on-click-modal="false"
      width="520px">
      <span slot="title">
        <span>修改密码</span>
      </span>
      <el-card class="box-card" shadow="never">
        <el-form
          ref="passwordObjForm"
          style="width: 100%"
          :rules="passwordObjRules"
          :model="passwordObj"
          size="mini"
          label-width="120px">
          <el-form-item label="新密码:" prop="password">
            <el-input v-model="passwordObj.password" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          plain
          type="primary"
          @click="passwordDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handlePassword">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 操作人 -->
    <el-dialog
      :visible.sync="perDataDialogVisible"
      :close-on-click-modal="false"
      width="700px">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>操作人列表</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="addPerHandle">添加操作人</el-button>
        </div>
        <!-- 操作人列表 -->
        <div>
          <el-table
            :data="tableDataOperator"
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
              prop="name"
              label="姓名"
              min-width="90"
              align="center" />
            <el-table-column
              prop="phoneNumber"
              label="手机号"
              min-width="90"
              align="center" />
            <el-table-column
              prop="isActive"
              label="状态"
              min-width="90"
              align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.isActive">启用</span>
                <span v-else>停用</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作"
              min-width="100">
              <template slot-scope="scope">
                <!-- <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleEdit(scope.row)">编辑
                </el-button> -->
                <el-button
                  v-if="scope.row.isActive"
                  size="mini"
                  type="text"
                  style="color:red"
                  @click="handleResetStatus(scope.row)">停用
                </el-button>
                <el-button
                  v-else
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleResetStatus(scope.row)">启用
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  style="color:#1890FF"
                  @click="handleOperatorDelete(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="margin:5px;float:right">
          <el-pagination
            :page-sizes="[10, 20, 30, 50]"
            layout="total, sizes, prev, pager, next"
            :total="totalOperator"
            :page-size.sync="operatorForm.size"
            @size-change="handleSizeOpChange"
            @current-change="handleOpCurrentChange" />
        </div>
      </el-card>
    </el-dialog>
    <el-dialog
      :visible.sync="perDialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <span slot="title">
        <span>新增操作人</span>
      </span>
      <el-card shadow="never">
        <el-form
          ref="perObjForm"
          style="width: 100%"
          :rules="perObjRules"
          :model="perObj"
          size="mini"
          label-width="100px">
          <el-form-item label="姓名：" prop="name">
            <el-input v-model="perObj.name" />
          </el-form-item>
          <el-form-item label="手机号：" prop="phoneNumber">
            <el-input v-model="perObj.phoneNumber" type="tel" />
          </el-form-item>
        </el-form>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          plain
          type="primary"
          @click="perDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleSavePer">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 二维码 -->
    <el-dialog
      :close-on-click-modal="false"
      title="组织机构二维码"
      :visible.sync="codeDialogVisible"
      width="500px">
      <el-card>
        <div
          id="dormCodeID"
          style="text-align:center;margin: 50 0">
          <div class="ooppOne">组织机构编码：{{ organizationCode.code }}</div>
          <div class="oopp">组织机构名称：{{ organizationCode.name }}</div>
          <div class="oopp">负责人：{{ organizationCode.contactName }}</div>
          <div class="oopp">电话：{{ organizationCode.contactPhoneNumber }}</div>
          <vue-qr
            :text="organizationCode.organizationCodeURL"
            :size="400" />
        </div>
      </el-card>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button @click="codeDialogVisible = false">取 消</el-button>
        <el-button
          v-print="dormPrintObj"
          type="primary"
          @click="handlePrintCode">打 印</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getOrganizations,
  creatOrganization,
  modifyOrganization, changeOperatorStatus, deledateOperator,
  resetPassword, deleteOrganization, getAlloperator, addOperator } from '@/api/user'
import { Message } from 'element-ui'
import vueQr from 'vue-qr'
// import { encrypt } from '@/utils/encrypt'
import { encrypt } from '@/utils/qq/encrypt-crypto'

// import { encrypt } from '@/utils/encrypt'

export default {
  components: {
    vueQr
  },
  data () {
    const validateIphoneCode = (rule, value, callback) => {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (value === '' || value === undefined || value === null) {
        callback()
      } else {
        if ((!reg.test(value)) && value !== '') {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      tableData: [],
      loading: false,
      form: {
        tenantCode: '',
        size: 20,
        page: 1
      },
      dialogVisible: false,
      addHandle: false,
      organization: {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        tenant: '',
        isEdit: false

      },
      organizationRules: {
        name: [
          { required: true, message: '组织机构名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '组织机构编码不能为空', trigger: 'blur' },
          { min: 4, max: 4, message: '组织机构编码是4位数字', trigger: 'blur' }
        ],
        contactName: [
          { required: true, message: '负责人不能为空', trigger: 'blur' }
        ],
        contactPhoneNumber: [
          { required: true, message: '负责人手机号不能为空', trigger: 'blur' },
          { validator: validateIphoneCode, trigger: 'blur' }
        ]
      },
      passwordDialogVisible: false,
      passwordObj: {
        userId: '',
        password: ''
      },
      passwordObjRules: {
        password: [
          { required: true, message: '新密码必须输入', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度6-12位', trigger: 'blur' }
        ]
      },
      total: 0,
      // 操作人
      tableDataOperator: [],
      perDataDialogVisible: false,
      operatorForm: {
        organizationCode: '',
        size: 20,
        page: 1
      },
      totalOperator: 0,
      perDialogVisible: false,
      perObj: {
        organizationCode: '',
        name: '',
        phoneNumber: ''
      },
      perObjRules: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateIphoneCode, trigger: 'blur' }
        ]
      },
      codeDialogVisible: false,
      organizationCode: {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        organizationCodeURL: ''
      },
      dormPrintObj: {
        id: 'dormCodeID',
        popTitle: '组织机构二维码',
        extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>,<style> #dormCodeID { text-align:center;height: auto !important; } <style>'
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
    initOptions () {

    },
    onSearch () {
      this.form.page = 1
      this.query()
    },
    query () {
      this.form.tenantCode = this.organizationName
      this.loading = true
      console.log(this.form)
      getOrganizations(this.form).then(res => {
        console.log(res)
        if (res.dataContent !== null) {
          this.tableData = res.dataContent.records
          this.total = res.dataContent.total
        }
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
    handleNewOrganization () {
      this.cleanOrigion()
      this.organization.tenant = this.organizationName
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['organizationForm'].clearValidate()
      })
    },
    handleSave () {
      console.log(this.organization)
      this.$refs.organizationForm.validate(valid => {
        if (valid) {
          this.addHandle = true
          if (this.organization.isEdit) {
            modifyOrganization(this.organization).then(res => {
              this.addHandle = false
              this.dialogVisible = false
              Message.success('组织机构修改成功')
              this.cleanOrigion()
              this.query()
            }).catch(err => {
              console.log(err)
              this.addHandle = false
              Message.error(err.message)
            })
          } else {
            creatOrganization(this.organization).then(res => {
              this.addHandle = false
              this.dialogVisible = false
              Message.success('创建组织机构成功')
              this.query()
            }).catch(err => {
              this.addHandle = false
              console.log(err)
              Message.error(err.message)
            })
          }
        }
      })
    },
    handleEdit (row) {
      this.cleanOrigion()
      this.organization = {
        id: row.id,
        name: row.name,
        code: row.code,
        contactName: row.contactName,
        contactPhoneNumber: row.contactPhoneNumber,
        tenant: this.organizationName,
        isEdit: true
      }
      this.dialogVisible = true
    },
    // 查看操作人
    handlePre (row) {
      // 请求操作人列表
      this.operatorForm.organizationCode = this.organizationName + row.code
      this.getAlloperatorData(true)
    },
    getAlloperatorData (ss) {
      // this.tableDataOperator = []
      // this.totalOperator = 0
      getAlloperator(this.operatorForm).then(res => {
        console.log(res)
        console.log('xxxx')
        this.tableDataOperator = res.dataContent.records
        this.totalOperator = res.dataContent.total
        if (ss) {
          this.perDataDialogVisible = true
        }
      }).catch(err => {
        Message.error(err.message)
      })
    },
    addPerHandle () {
      this.perObj = {
        organizationCode: this.operatorForm.organizationCode,
        name: '',
        phoneNumber: ''
      }
      this.perDialogVisible = true
      this.$nextTick(() => {
        this.$refs['perObjForm'].clearValidate()
      })
    },
    handleSavePer () {
      this.$refs.perObjForm.validate(valid => {
        if (valid) {
          addOperator(this.perObj).then(res => {
            if (res.code === '0') {
              Message.success('新增操作人成功')
              this.getAlloperatorData(false)
              this.clearOperatorData()
              this.perDialogVisible = false
            }
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },
    clearOperatorData () {
      this.perObj = {
        organizationCode: this.operatorForm.organizationCode,
        name: '',
        phoneNumber: ''
      }
    },
    handleSizeOpChange (val) {
      this.operatorForm.size = val
      this.getAlloperatorData(false)
    },
    handleOpCurrentChange (val) {
      this.operatorForm.page = val
      this.getAlloperatorData(false)
    },
    // 修改
    // 删除
    handleOperatorDelete (row) {
      this.$confirm('此操作将删除该操作人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deledateOperator(row.id).then(res => {
          Message.success('删除成功')
          this.getAlloperatorData(false)
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },

    // 修改状态
    handleResetStatus (row) {
      console.log(row)
      const objqq = {
        id: row.id,
        isActive: !row.isActive
      }
      const message = row.isActive ? '是否停用该操作人?' : '是否启用该操作人?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        changeOperatorStatus(objqq).then(res => {
          Message.success('状态修改成功')
          this.getAlloperatorData(false)
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },

    // -------------------------------------------------------------
    clickEQ (row) {
      console.log(row)
      this.clearCodeData()
      const codeurl = this.organizationName + row.code
      const rowObj = {
        code: codeurl,
        contactName: row.contactName,
        contactPhoneNumber: row.contactPhoneNumber,
        id: row.id,
        name: row.name
      }
      this.organizationCode = {
        code: row.code,
        name: row.name,
        contactName: row.contactName,
        contactPhoneNumber: row.contactPhoneNumber,
        organizationCodeURL: encrypt(JSON.stringify(rowObj))
      }
      this.codeDialogVisible = true
    },
    clearCodeData () {
      this.organizationCode = {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        organizationCodeURL: ''
      }
    },
    handlePrintCode () {
      console.log('打印')
    },
    handleResetPassword (row) {
      this.cleanPassObj()
      this.passwordObj.userId = row.id
      this.passwordDialogVisible = true
    },
    handlePassword () {
      this.$refs.passwordObjForm.validate(valid => {
        if (valid) {
          const obj = {
            userId: this.passwordObj.userId,
            password: this.passwordObj.password
          }
          resetPassword(obj).then(res => {
            Message.success('修改密码成功')
            this.cleanPassObj()
            this.query()
            this.passwordDialogVisible = false
          }).catch(err => {
            Message.error(err.message)
          })
        }
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将删除该组织机构, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrganization(row.id).then(res => {
          Message.success('删除成功')
          this.query()
        }).catch(err => {
          console.log(err)
          Message.error(err.message)
        })
      })
    },
    cleanPassObj () {
      this.passwordObj = {
        userId: '',
        password: ''
      }
    },
    cleanOrigion () {
      this.organization = {
        id: '',
        code: '',
        contactName: '',
        contactPhoneNumber: '',
        name: '',
        tenant: '',
        isEdit: false
      }
    },
    closedDialog () {
      this.$refs.organizationForm.resetFields()
      this.dialogVisible = false
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
.oopp {
  margin-top: 10px;
}
</style>
