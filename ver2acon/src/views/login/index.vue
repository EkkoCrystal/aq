<template>
  <div class="login-container">
    <div style="margin-top:13%;">
      &nbsp;&nbsp;
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left">
      <div class="title-container">
        <h3 class="title">{{ title }}</h3>
      </div>

      <el-form-item prop="username">
        <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span> -->
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          maxlength="18"
          auto-complete="on"
          prefix-icon="el-icon-user-solid" />
      </el-form-item>

      <el-form-item prop="plainPassword">
        <!-- <span class="svg-container">
          <svg-icon icon-class="password" />
        </span> -->
        <el-input

          ref="password"
          v-model="loginForm.plainPassword"
          :type="passwordType"
          placeholder="密码"
          name="password"
          maxlength="18"
          tabindex="2"
          auto-complete="on"
          prefix-icon="el-icon-lock"
          show-password
          @keyup.enter.native="handleLogin" />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span> -->
      </el-form-item>
      <el-form-item prop="tenant">
        <!-- <span class="svg-container">
          <svg-icon icon-class="user" />
        </span> -->
        <el-input
          ref="tenant"
          v-model="loginForm.tenant"
          placeholder="组织编码"
          name="tenant"
          type="text"
          tabindex="3"
          maxlength="18"
          auto-complete="on"
          prefix-icon="el-icon-user-solid" />
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin">登录</el-button>
      <div style="text-align:center;width:100%;margin-bottom:20px;font-size:14px;color:#868585">软件版本: V1(1.0.0.0)</div>
    </el-form>

    <div class="tips">
      <span style="margin-left:-130px">Power by 艾康生物医疗软件部</span>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
// import { encrypt } from '@/utils/encrypt'
export default {
  name: 'Login',
  data () {
    // const validateUsername = (rule, value, callback) => {
    //   if (!validUsername(value)) {
    //     callback(new Error('Please enter the correct user name'))
    //   } else {
    //     callback()
    //   }
    // }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度必须6-12位！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        // organizationCode: '1001',
        username: '',
        password: '',
        plainPassword: '',
        tenant: ''
      },
      loginRules: {
        username: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 5, max: 12, message: '用户名长度5-12位', trigger: 'blur' }
        ],
        plainPassword: [
          { required: true, trigger: 'blur', validator: validatePassword },
          { min: 6, max: 12, message: '密码长度6-12位', trigger: 'blur' }
        ],
        tenant: [
          { required: true, trigger: 'blur', message: '组织编码必须输入' },
          { min: 3, max: 8, trigger: 'blur', message: '组织编码长度3-8位' }
        ]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  computed: {
    // ...mapGetters(['name', 'token', 'organizationName']),
    title: function () {
      return this.$store.state.settings.title
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      // console.log(this.$baseConfig)
      if (this.$baseConfig !== undefined && this.$baseConfig !== null) {
        console.log('--')
      }
      this.loginForm.username = this.name
    },
    showPwd () {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin () {
      console.log(this.loginForm)
      console.log('x1123213213')
      this.$refs.loginForm.validate(valid => {
        // console.log('valid' + valid)
        if (valid) {
          this.loading = true
          // this.loginForm.password = encrypt(this.loginForm.plainPassword)
          this.loginForm.password = this.loginForm.plainPassword
          console.log(this.loginForm)
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
              this.loading = false
            })
            .catch((res) => {
              console.log(res)
              // const { code, message } = res.response.data
              Message.error(res.message)
              this.loading = false
            })
        } else {
          // Message.error('数据不正确，无法提交')
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  vertical-align: center;

  .login-form {
    position: relative;
    width: 480px;
    max-width: 100%;
    padding: 20px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
    border-radius: 15px;

  }

  .tips {
    margin:0 auto;
    font-size: 18px;
    left:50%;

    color: #fff;
    bottom: 20px;
    position: fixed;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #ffffff;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #43556d;
      margin: 25px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;

  }
}
</style>
