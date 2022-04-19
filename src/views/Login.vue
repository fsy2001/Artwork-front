<template>
  <div class="page">
    <el-card class="page-box">
      <div slot="header" class="page-title-box">
        <h1 class="page-title">
          {{ $t('login') }}
        </h1>
      </div>
      <el-form label-position="left" label-width="80px">
        <el-form-item class="login-input" :label="$t('username')">
          <el-input v-model="username" :placeholder="$t('username-prompt')"></el-input>
        </el-form-item>
        <el-form-item class="login-input" :label="$t('password')">
          <el-input v-model="password" :placeholder="$t('password-prompt')" show-password></el-input>
        </el-form-item>
        <!--   验证码   -->
        <el-form-item class="login-input" :label="$t('captcha')">
          <el-input v-model="captcha" :placeholder="$t('captcha-prompt')"
                    style="width: 150px; margin-right: 1em"></el-input>
          <canvas width="80" height="30" id="captcha"></canvas>
        </el-form-item>
        <el-form-item style="display: flex; justify-content: center">
          <el-button type="primary" @click="login">{{ $t('login') }}</el-button>
        </el-form-item>
      </el-form>

      <div class="debug">
        {{captchaRef}}, {{captcha}}
      </div>
    </el-card>
  </div>
</template>

<script>
import router from "@/router";
import CaptchaMini from 'captcha-mini'

export default {
  name: "Login",
  data() {
    return {
      // TODO: 交付时删掉这个
      username: "fsy2001",
      password: "password",
      captcha: '',
      captchaRef: '',
    }
  },
  mounted() {
    let captcha = new CaptchaMini({
      content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    })
    captcha.draw(document.querySelector('#captcha'), r => {
      this.captchaRef = r
    })
  },
  methods: {
    login: function () {
      if (this.username === "" || this.password === "") { // 检查是否填写完整
        this.$alert(this.$i18n.t('login-complete'))
        return
      }

      // TODO: 交付时取消注释
      // if (this.captcha !== this.captchaRef) {
      //   this.$alert(this.$i18n.t('wrong-captcha'))
      //   return
      // }

      // 发送网络请求
      fetch('/api/login?' + new URLSearchParams({
        username: this.username,
        password: this.password
      }), {
        method: 'POST'
      })
          .then(response => {
            this.success = response.ok
            return response
          })
          .then(res => {
            return res.json()
          })
          .then(data => {
            if (this.success) { // 登录成功
              this.$store.commit('login', data.user) // 修改全局状态
              this.$store.commit('cart') // 刷新购物车
              this.$store.commit('order') // 获取订单
              this.$store.commit('history') // 获取浏览记录
              router.push({name: 'Home'}) // 跳转到主页
            } else { // 登录失败
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })
    }
  }
}
</script>

<style scoped>

.login-input {
  width: 80%;
}

#captcha {
  position: relative;
  top: 10px;
}
</style>
