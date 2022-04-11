<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">

      <span style="margin-right:30px;font-size:20px;line-height:20px">{{ departmentName }}</span>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span style="margin-bottom:25px font-size:24px">{{ avatar }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link :to="{name: 'StaffQR'}">查看二维码</router-link> -->
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <!-- <el-dropdown-item divided @click.native="showQr">
            <span style="display:block;">二维码</span>
          </el-dropdown-item> -->
          <!-- <el-dropdown-item divided @click.native="pushToBigScreen">
            <span style="display:block;">院内大屏</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="changePassword">
            <span style="display:block;">修改密码</span>

          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <div>
      <el-dialog
        title="医生二维码"
        :visible.sync="dialogVisible"
        :modal="false"
        width="30%">
        <div style="display:flex">
          <div style="margin: 20px auto;text-align:center">
            <div style="margin:10px;font-size:16pt">微信公众号扫描二维码可以关注医生</div>
            <vue-qr :logo-scale="20" :text="qrCode" :margin="0" :dot-scale="1" />
          </div>
        </div>

        <span slot="footer" class="dialog-footer">

          <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="密码修改"
        :visible.sync="passwordDialogVisible"
        width="30%"
        :modal="false">

        <div>
          <el-form
            ref="passwordForm"
            style="width:100%"
            :model="user"
            :rules="userRule"

            size="mini"
            label-width="120px">
            <el-form-item label="用户名:">
              {{ user.userName }}
            </el-form-item>
            <el-form-item label="旧密码:" prop="oldPassword">
              <el-input v-model="user.oldPassword" placeholder="请输入旧密码" show-password />
            </el-form-item>
            <el-form-item label="新密码:" prop="password">
              <el-input v-model="user.password" placeholder="请输入新密码" show-password />
            </el-form-item>
            <el-form-item label="密码规则:">
              <ol>
                <li>最短6位，最长12位 {6,12}</li>

              </ol>

            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSavePassword">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import vueQr from 'vue-qr'
import { resetPassword } from '@/api/user'
import { encrypt } from '@/utils/encrypt'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    vueQr
  },
  data () {
    return {
      codeValue: '12342143241241243',
      dialogVisible: false,
      passwordDialogVisible: false,
      user: {
        userName: '',
        password: '',
        oldPassword: ''
      },
      userRule: {
        password: [
          { required: true, message: '密码必须输入', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度6-12位', trigger: 'blur' }
        ],
        oldPassword: [
          { required: true, message: '旧密码必须输入', trigger: 'blur' },
          { min: 6, max: 12, message: '旧密码长度6-12位', trigger: 'blur' }
        ]
      }

    }
  },

  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'organizationName',
      'organizationCode',
      'departmentName'
    ]),
    qrCode () {
      return this.avatar
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.user.userName = this.avatar
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout () {
      this.$confirm('您确定退出平台?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('user/logout').then(() => {
          // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
          this.$router.push(`/login`)
        }).catch(err => {
          console.log(err)
          Message.error(err)
        })
      })
    },
    async showQr () {
      console.log('showqr')
      this.dialogVisible = true
    },
    async changePassword () {
      this.user.password = ''
      this.passwordDialogVisible = true
    },
    handleSavePassword () {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          if (this.user.oldPassword === this.user.password) {
            Message.error('旧密码不能于和新密码一致，请修改')
            return
          }
          resetPassword({
            password: encrypt(this.user.oldPassword),
            newPassword: encrypt(this.user.password),
            userName: this.user.userName
          }).then(res => {
            Message.success('修改密码成功')
            this.passwordDialogVisible = false
          }).catch(err => {
            console.log(err)

            Message.error(err.message)
          })
        }
      })
      // const pattern = /^.*(?=.{6,12})(?=.*\d)(?=.*[A-Z]{2,})(?=.*[a-z]{2,})(?=.*[!@#$%^&*?\(\)]).*$/
      // const pattern = /^\w{6,12}$/
      // if (!pattern.test(this.user.oldPassword)) {
      //   Message.error('旧密码不能为空或者密码格式不正确')
      //   return
      // }
      // if (!pattern.test(this.user.password)) {
      //   Message.error('新密码不能为空或者密码格式不正确')
      //   return
      // }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
