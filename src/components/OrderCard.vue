<template>
  <div>
    <el-card class="artwork-card" :body-style="{ padding: '0px' }">
      <el-image fit="cover" :src="order.artwork.imgPath" class="art-card-img"></el-image>

      <div class="art-card-info">
        <h2 class="art-card-title">
          <router-link class="art-card-title-text" :to="'/artwork/' + order.artwork.id">
            {{ order.artwork.title }}
          </router-link>
          <el-button v-if="order.status !== 'canceled'" @click="visible = true" type="text"
                     style="float: right">
            <i class="el-icon-info"></i>
          </el-button>
          <el-button v-if="payable" @click="payOrder" type="text" style="float: right">
            <i class="el-icon-money"></i>
          </el-button>
        </h2>

        <el-divider></el-divider>
        <span class="art-card-detail">{{ $t('artwork-detail') }}</span>
        <p class="art-card-text">
          订单编号：{{ order.id }} <br>
          时间：{{ order.generateTime }} <br>
          {{ $t('price') }}：{{ order.artwork.price }}
        </p>
      </div>
      <span class="sold-text" v-if="canceled">{{ $t('canceled') }}</span>
      <span class="sold-text" v-if="confirmed">{{ $t('confirmed') }}</span>
      <span class="sold-text" v-if="paid">{{ $t('delivering') }}</span>
      <span class="sold-text" v-if="payable">{{ $t('payable') }}</span>
    </el-card>

    <!--  订单详情面板  -->
    <el-dialog :title="$t('order-detail')" :visible.sync="visible">
      <!--  时间线  -->
      <el-timeline>
        <el-timeline-item color="#0bbd87">
          已下单
        </el-timeline-item>
        <el-timeline-item :color="alreadyPaid ? '#0bbd87' : '#e4e7ed'">
          已付款
        </el-timeline-item>
        <el-timeline-item :color="alreadyPaid ? '#0bbd87' : '#e4e7ed'" :timestamp="order.deliveryTime">
          已发货
        </el-timeline-item>
        <el-timeline-item :color="order.shippingStatus >= 1 ? '#0bbd87' : '#e4e7ed'">
          {{ $store.state.user.addressProvince }}
        </el-timeline-item>
        <el-timeline-item :color="order.shippingStatus >= 2 ? '#0bbd87' : '#e4e7ed'">
          {{ $store.state.user.addressCity }}
        </el-timeline-item>
        <el-timeline-item :color="order.shippingStatus >= 3 ? '#0bbd87' : '#e4e7ed'">
          {{ $store.state.user.addressDistrict }}
        </el-timeline-item>
        <el-timeline-item :color="order.shippingStatus >= 4 ? '#0bbd87' : '#e4e7ed'">
          {{ $store.state.user.addressDetail }}
        </el-timeline-item>
        <el-timeline-item :color="confirmed ? '#0bbd87' : '#e4e7ed'">
          已确认送达
        </el-timeline-item>
      </el-timeline>
      <el-button type="primary" :disabled="order.shippingStatus !== 4"
                 @click="confirmDelivered">{{ $t('confirm-delivered') }}
      </el-button>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: "OrderCard",
  props: ['order'],
  data() {
    return {
      visible: false
    }
  },
  computed: {
    canceled: function () {
      return this.order.status === 'canceled'
    },
    payable: function () {
      return this.order.status === 'waiting'
    },
    paid: function () {
      return this.order.status === 'paid'
    },
    confirmed: function () {
      return this.order.status === 'received'
    },
    alreadyPaid: function () {
      return this.order.status === 'paid' || this.order.status === 'received';
    }
  },
  methods: {
    payOrder: function () {
      fetch('/api/order/pay?' + new URLSearchParams({order: this.order.id}),
          {method: 'POST'})
          .then(res => {
            this.success = res.ok
            if (res.ok) {
              this.$alert(this.$t('paid'))
              this.$store.commit('order') // 重新加载订单
            }
            return res.json()
          })
          .then(data => {
            if (!this.success)
              this.$alert(this.$i18n.t(data.message))
          })
    },
    confirmDelivered: function () {
      fetch('/api/order/confirm?' + new URLSearchParams({order: this.order.id}),
          {method: 'POST'})
          .then(res => {
            this.success = res.ok
            if (res.ok) {
              this.$alert(this.$t('confirmed'))
              this.$store.commit('order') // 重新加载订单
            }
            return res.json()
          })
          .then(data => {
            if (!this.success) this.$alert(this.$t(data.message))
          })
    }
  }
}
</script>

<style scoped>

.artwork-card {
  padding: 0 !important;
  width: 95%;
  display: flex;
  flex-direction: row;
  margin-top: 25px;
  position: relative;
}

.art-card-img {
  min-height: 190px;
  height: 100%;
  width: 170px;
}

.art-card-title {
  margin: 5px 0 5px 0;
}

.art-card-title-text {
  color: black;
  text-decoration: none;
}

.art-card-info {
  float: right;
  margin-left: 15px;
  width: 250px;
}

.art-card-detail {
  font-weight: bold;
}

.art-card-text {
  color: #999;
  font-size: 13px;
}

.sold-text {
  margin-left: 30px;
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #C0C4CC;
  font-weight: bold;
}

</style>
