<template>
  <el-header>
    <el-menu mode="horizontal" router class="navigator" default-active="/">
      <li class="el-menu-item site-icon">
        <img src="@/assets/icon.svg" alt="site icon">
      </li>


      <el-menu-item index="/">{{ $t('home') }}</el-menu-item>
      <el-menu-item index="/search">{{ $t('search') }}</el-menu-item>
      <el-menu-item>{{ $t('detail') }}</el-menu-item>

      <el-submenu index="language">
        <template slot="title">{{ $t('language') }}</template>
        <el-menu-item @click="switchLang('zh')">中文</el-menu-item>
        <el-menu-item @click="switchLang('en')">English</el-menu-item>
      </el-submenu>

      <el-menu-item v-if="!$store.state.login" class="user" index="/login">{{ $t('login') }}</el-menu-item>
      <el-menu-item v-if="!$store.state.login" class="user" index="/register">{{ $t('register') }}</el-menu-item>


      <el-submenu v-if="$store.state.login" class="user" index="user">
        <template slot="title"> {{ $store.state.user.username }}</template>

        <el-menu-item index="/user-center">{{ $t('user-center') }}</el-menu-item>
        <el-badge :hidden="$store.state.cart.length === 0" :value="$store.state.cart.length" :max="10" class="item">
          <el-popover placement="left" width="460" trigger="hover">
            <ArtworkCard v-for="artwork in $store.state.cart" :key="artwork.id" :artwork="artwork" :cart="true"/>
            <el-menu-item slot="reference" index="/cart">{{ $t('shopping-cart') }}</el-menu-item>
          </el-popover>
        </el-badge>
        <el-menu-item index="/chat">{{ $t('chatroom') }}</el-menu-item>
        <el-menu-item @click="logout">{{ $t('logout') }}</el-menu-item>
      </el-submenu>


    </el-menu>
  </el-header>
</template>

<script>
import ArtworkCard from "@/components/ArtworkCard";
import i18n from "@/i18n";
import router from "@/router";

export default {
  name: "Navigator",
  components: {ArtworkCard},
  methods: {
    switchLang(lang) { // 切换全局语言
      i18n.locale = lang
    },
    logout: function () {
      fetch('/api/logout', { // 执行退出登录
        method: 'POST'
      })
      this.$store.commit('logout') // 设置全局状态
      router.push({name: 'Home'})
    }
  }
}
</script>

<style scoped lang="scss">

.user {
  float: right !important;
}

.site-icon {
  font-size: 25px;
  width: 6em;
}

</style>
