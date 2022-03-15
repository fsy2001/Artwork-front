<template>
  <div class="page">
    <el-card class="page-box">
      <div slot="header" class="page-title-box">
        <h1 class="page-title">
          {{ $t('register') }}
        </h1>
      </div>

      <!--   表单主体   -->
      <el-form :model="form" :ref="form" :rules="rules" label-position="left" label-width="80px">

        <!--   用户名 & 密码   -->
        <el-form-item :label="$t('username')" prop="username">
          <el-input v-model="form.username" :placeholder="$t('username-prompt')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('password')" prop="password">
          <el-input v-model="form.password" :placeholder="$t('password-prompt')" show-password></el-input>
          <el-progress :percentage="passwordStrength(form.password)"
                       v-show="form.password !== ''"
                       :status="passwordStatus(form.password)"></el-progress>
        </el-form-item>
        <el-form-item :label="$t('confirm-password')" prop="confirm">
          <el-input v-model="form.confirmPassword" :placeholder="$t('confirm-prompt')" show-password></el-input>
        </el-form-item>

        <!--   邮箱 & 电话   -->
        <el-form-item :label="$t('email')" prop="email">
          <el-input v-model="form.email" :placeholder="$t('email-prompt')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('tel')" prop="tel">
          <el-input v-model="form.tel" :placeholder="$t('tel-prompt')"></el-input>
        </el-form-item>

        <!--   地区   -->
        <el-form-item :label="$t('region')">
          <!--   ref: https://blog.csdn.net/qq_38128179/article/details/98877502   -->
          <el-cascader :placeholder="$t('select-prompt')" size="large" :options="options"
                       v-model="form.address"></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('address')">
          <el-input v-model="form.addressDetail" :placeholder="$t('address-prompt')"></el-input>
        </el-form-item>

        <!--   提交   -->
        <el-form-item style="display: flex; justify-content: center">
          <el-button type="primary" @click="submit" style="align-self: center">{{ $t('register') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {CodeToText, regionData} from 'element-china-area-data'
import router from "@/router";

export default {
  name: "Register",
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value === this.form.username)
        callback(new Error(this.$i18n.t('password-conflict')))
      else if (value.length < 6)
        callback(new Error(this.$i18n.t('invalid-password')))
      else callback()
    }

    let validateConfirm = (rule, value, callback) => {
      if (this.form.confirmPassword !== this.form.password)
        callback(new Error(this.$i18n.t('invalid-confirm')))
      else callback()
    }

    return {
      options: regionData,
      form: {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        tel: "",
        address: [],
        addressDetail: ""
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            pattern: /^[a-zA-Z0-9_-]+$/,
            message: this.$i18n.t('invalid-username')
          }
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword
          }
        ],
        confirm: [
          {
            required: true,
            trigger: 'blur',
            validator: validateConfirm
          }
        ],
        email: [
          {
            required: true,
            trigger: 'blur',
            message: this.$i18n.t('invalid-email')
          }
        ]
      }
    }
  },
  computed: {},
  methods: {
    passwordStrength: function (password) { // 检查密码强度
      let passwordLength = password.length
      if (passwordLength < 6)
        return 30
      else if (passwordLength < 9)
        return 60
      else
        return 100
    },
    passwordStatus: function (password) { // 检查密码强度
      let passwordLength = password.length
      if (passwordLength < 6)
        return 'exception'
      else if (passwordLength < 9)
        return 'warning'
      else
        return 'success'
    },
    submit: function () {
      // TODO: 检查是否填写完整


      let userObj = {
        username: this.form.username,
        password: this.form.password,
        email: this.form.email,
        tel: this.form.tel,
        addressProvince: CodeToText[this.form.address[0]],
        addressCity: CodeToText[this.form.address[1]],
        addressDistrict: CodeToText[this.form.address[2]],
        addressDetail: this.form.addressDetail
      }

      fetch('/api/user', {
        method: 'POST',
        body: JSON.stringify(userObj),
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      })
          .then(response => {
            this.success = response.ok
            if (this.success) {
              router.push({name: 'Login'})
            }
            return response
          })
          .then(res => {
            if (!this.success)
              return res.json()
          })
          .then(data => {
            if (!this.success) {
              this.$alert(this.$i18n.t(data.message))
            }
          })
    },
  }
}
</script>

<style scoped>


.page-box {
  width: 500px;
  margin-top: 30px;
  padding: 40px;
}

</style>
