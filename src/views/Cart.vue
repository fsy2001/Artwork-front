<template>
  <div class="page">
    <el-card class="page-box">
      <div class="page-title-box" slot="header">
        <h1 class="page-title">
          {{ $t('shopping-cart') }}
        </h1>
      </div>
      <div class="cart-center cart-empty">
        <span class="cart-empty-text" v-if="$store.state.cart.length === 0">{{ $t('empty-cart') }}</span>
      </div>

      <ArtworkCard v-for="artwork in $store.state.cart" :key="artwork.id" :artwork="artwork" :cart="true"/>

      <div class="cart-center">
        <el-button type="primary" @click="showPanel">{{ $t('clear-cart') }}</el-button>
      </div>
    </el-card>

    <!--  确认订单面板  -->
    <el-dialog :title="$t('clear-cart')" :visible.sync="visibleOrderPanel">
      <!--   订单信息展示   -->
      <el-descriptions :title="$t('order-detail')" direction="vertical" border>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            {{ $t('tel') }}
          </template>
          {{ $store.state.user.tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-coin"></i>
            {{ $t('balance') }}
          </template>
          {{ $store.state.user.balance }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-money"></i>
            {{ $t('total-price') }}
          </template>
          {{ this.totalPrice }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('province') }}
          </template>
          {{ $store.state.user.addressProvince }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('city') }}
          </template>
          {{ $store.state.user.addressCity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('district') }}
          </template>
          {{ $store.state.user.addressDistrict }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            {{ $t('address-detail') }}
          </template>
          {{ $store.state.user.addressDetail }}
        </el-descriptions-item>
      </el-descriptions>

      <span class="dialog-footer" slot="footer">
        <el-button @click="visibleOrderPanel = false">{{ $t('cancel') }}</el-button>
        <el-button @click="clearCart" type="primary">{{ $t('place-order') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ArtworkCard from "@/components/ArtworkCard";
import router from "@/router";

export default {
  name: "Cart",
  components: {ArtworkCard},
  data() {
    return {
      visibleOrderPanel: false
    }
  },
  computed: {
    totalPrice: function () {
      let sum = 0
      this.$store.state.cart.forEach(cart => {sum += cart.price})
      return sum
    }
  },
  mounted() {
    if (!this.$store.state.login) {
      this.$alert(this.$t('require-login'))
      router.push({name: 'Login'})
    }
  },
  methods: {
    clearCart: async function () {
      this.visibleOrderPanel = false // 关闭面板

      fetch('/api/cart/clear', {
        method: 'POST'
      })
          .then(response => {
            this.success = response.ok
            return response
          })
          .then(res => {
            if (!this.success)
              return res.json()
          })
          .then(data => {
            if (this.success) {
              this.$alert(this.$i18n.t('cart-cleared'))
            } else {
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })

      await new Promise(r => setTimeout(r, 200)); // 等待
      this.$store.commit('cart') // 刷新购物车
    },
    showPanel: function () {
      if (this.$store.state.cart.length !== 0)
        this.visibleOrderPanel = true
      else
        this.$alert(this.$t('empty-cart'))
    }
  },
}
</script>

<style scoped>

.cart-center {
  display: flex;
  justify-content: center;
  padding-top: 30px;
}

.cart-empty {
  margin-bottom: 10px;
}

.cart-empty-text {
  font-size: 12px;
  color: #C0C4CC;
}

</style>
