<template>
  <div class="page">
    <el-card class="page-box">
      <div slot="header" class="page-title-box">
        <h1 class="page-title">
          {{ $t('user-center') }}
        </h1>
      </div>

      <!--   用户名 & 头像   -->
      <el-row class="user-title" style="margin-bottom: 40px;">
        <el-avatar :size="60" :src="$store.state.user.img"></el-avatar>
        <span class="user-title-username"> {{ user.username }} </span>
        <Avatar/>
      </el-row>

      <!--  用户信息展示   -->
      <el-descriptions :title="$t('user-detail')" direction="vertical" border>
        <template slot="extra">
          <el-button @click="visible.recharge = true">{{ $t('recharge') }}</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-message"></i>
            {{ $t('email') }}
          </template>
          {{ user.email }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            {{ $t('tel') }}
          </template>
          {{ user.tel }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-coin"></i>
            {{ $t('balance') }}
          </template>
          {{ user.balance }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('province') }}
          </template>
          {{ user.addressProvince }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('city') }}
          </template>
          {{ user.addressCity }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            {{ $t('district') }}
          </template>
          {{ user.addressDistrict }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            {{ $t('address-detail') }}
          </template>
          {{ user.addressDetail }}
        </el-descriptions-item>
      </el-descriptions>

      <el-collapse>
        <!--  我的好友   -->
        <el-collapse-item :title="$t('friend')">
          <el-table :data="friends" stripe>
            <el-table-column :label="$t('username')">
              <template slot-scope="scope">
                <div class="user-title">
                  <el-avatar :size="25" :src="scope.row.img"></el-avatar>
                  <span style="margin-left: 10px">{{ scope.row.username }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-button @click="visible.newFriends = true" size="small">{{ $t('new-friends') }}</el-button>
                <el-button @click="visible.friendApply = true; fetchApplications()"
                           size="small">{{ $t('friend-apply') }}
                </el-button>
              </template>

              <template slot-scope="scope">
                <el-button @click="fetchMessage(scope.row.username);
                visible.message = true;
                messageTo = scope.row.username"
                           type="text">
                  <i class="el-icon-chat-dot-round"></i>
                  {{ $t('chat') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>

        <!--  我的订单   -->
        <el-collapse-item :title="$t('order')">
          <OrderCard v-for="order in $store.state.orders" :key="order.id" :order="order">
            <el-button v-if="order.status === 'paid'" @click="expandDetailPanel(order.id)" type="text"
                       style="float: right">
              <i class="el-icon-info"></i>
            </el-button>
          </OrderCard>
        </el-collapse-item>

        <!--  最近浏览  -->
        <el-collapse-item :title="$t('recent-view')">
          <ArtworkCard v-for="artwork in $store.state.viewHistory" :key="artwork.id" :artwork="artwork" :cart="false"/>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!--  改头像面板  -->
    <el-dialog :title="$t('edit-avatar')" :visible.sync="visible.avatar">
      <!--  TODO: 改头像    -->
    </el-dialog>

    <!--  充值面板  -->
    <el-dialog class="recharge-panel" :title="$t('recharge')" :visible.sync="visible.recharge">
      <el-form>
        <el-form-item :label="$t('recharge-amount')">
          <el-input-number v-model="rechargeValue" controls-position="right" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visible.recharge = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="recharge">{{ $t('recharge') }}</el-button>
      </div>
    </el-dialog>

    <!--  添加申请好友面板  -->
    <el-dialog :title="$t('new-friends')" :visible.sync="visible.newFriends">
      <el-form>
        <el-form-item :label="$t('username')">
          <el-input v-model="newFriendName" :placeholder="$t('new-friend-prompt')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visible.newFriends = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="newFriends">{{ $t('send') }}</el-button>
      </div>
    </el-dialog>

    <!--  接受好友申请面板  -->
    <el-dialog :title="$t('friend-apply')" :visible.sync="visible.friendApply">
      <el-table :data="applications">
        <el-table-column :label="$t('username')" prop="username"></el-table-column>
        <el-table-column :label="$t('action')">
          <template slot-scope="scope">
            <el-button @click="acceptFriend(scope.row.username)" type="text">{{ $t('approve') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--  私信面板  -->
    <el-dialog :title="$t('chat')" :visible.sync="visible.message">
      <Message :message="message" :key="message.id" v-for="message in messageList"></Message>
      <el-form :inline="true">
        <el-form-item :label="$t('message')">
          <el-input v-model="messageContent" :placeholder="$t('message-prompt')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="sendMessage" type="primary">{{ $t('send') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--  订单详情面板  -->
    <el-dialog :title="$t('order-detail')" :visible.sync="visible.orderDetail">
      <!--  时间线  -->
      <el-timeline>
        <el-timeline-item v-for="(step, index) in deliveryStatus"
                          :key="index"
                          :color="step.color">
          {{ step.content }}
        </el-timeline-item>

      </el-timeline>
      <el-button type="primary" @click="confirmDelivered">{{ $t('confirm-delivered') }}</el-button>
    </el-dialog>
  </div>
</template>

<script>
import Message from "@/components/Message";
import OrderCard from "@/components/OrderCard";
import ArtworkCard from "@/components/ArtworkCard";
import router from "@/router";
import Avatar from "@/components/Avatar";

export default {
  name: "UserCenter",
  components: {ArtworkCard, Message, OrderCard, Avatar},

  data() {
    return {
      user: this.$store.state.user,
      friends: [],
      applications: [],
      messageList: [],
      messageTo: '',
      messageContent: '',
      visible: {
        avatar: false,
        recharge: false,
        newFriends: false,
        friendApply: false,
        message: false,
        orderDetail: false
      },
      rechargeValue: 0,
      newFriendName: "",
    }
  },
  computed: {
    deliveryStatus: function () {
      let step = this.$store.state.activeOrder.shippingStatus
      let user = this.$store.state.user
      let arr = [
        {content: user.addressProvince},
        {content: user.addressCity},
        {content: user.addressDistrict},
        {content: user.addressDetail}
      ]

      for (let i = 1; i <= 4; i++) {
        if (i <= step)
          arr[i - 1].color = '#0bbd87'
      }

      return arr
    }
  },
  methods: {
    recharge: function () { // 提交充值数据
      fetch('/api/recharge?' + new URLSearchParams({
        val: this.rechargeValue
      }), {
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
              this.$alert(this.$i18n.t('recharge-success'))
              this.user.balance += this.rechargeValue
            } else {
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })
    },
    fetchFriends: function () { // 获取好友列表
      fetch("/api/friend")
          .then(res => {
            this.success = res.ok
            return res.json()
          })
          .then(data => {
            if (this.success)
              this.friends = data
            else
              this.$alert(this.$i18n.t(data.message))
          })
    },
    fetchApplications: function () {
      fetch("/api/friend/apply")
          .then(res => {
            this.success = res.ok
            return res.json()
          })
          .then(data => {
            if (this.success) {
              // 转化数据格式
              this.applications = []
              data.forEach(username => {
                this.applications.push({username: username})
              })
            } else
              this.$alert(this.$i18n.t(data.message))
          })
    },
    newFriends: function () { // 提交好友申请
      fetch('/api/friend/add?' + new URLSearchParams({
        friend: this.newFriendName
      }), {
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
              this.$alert(this.$i18n.t('apply-sent'))
            } else {
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })
    },
    acceptFriend: function (username) { // 接受好友申请
      fetch('/api/friend/accept?' + new URLSearchParams({
        friend: username
      }), {
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
              this.$alert(this.$i18n.t('approved'))
            } else {
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })
      this.fetchFriends()
      this.fetchApplications()
    },
    fetchMessage: function (username) {
      fetch('/api/message?' + new URLSearchParams({friend: username}))
          .then(res => {
            this.success = res.ok
            return res.json()
          })
          .then(data => {
            if (this.success)
              this.messageList = data
            else
              this.$alert(this.$i18n.t(data.message))
          })
    },
    sendMessage: function () {
      fetch('/api/message?' + new URLSearchParams({
        friend: this.messageTo
      }), {
        method: 'POST',
        body: this.messageContent
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
              this.$alert(this.$i18n.t('message-sent'))
              this.fetchMessage(this.messageTo) // 刷新私信列表
            } else {
              this.$alert(this.$i18n.t(data.message))
            }
          })
          .catch(error => {
            console.log(error)
            this.$alert(this.$i18n.t('network-error'))
          })
    },
    expandDetailPanel: function (id) {
      this.$store.commit('active', id)
      this.$emit('order-detail')
      this.visible.orderDetail = true
    },
    confirmDelivered: function () {
      let id = this.$store.state.activeOrderId

      fetch('/api/order/confirm?' + new URLSearchParams({order: id}),
          {method: 'POST'})
          .then(res => {
            this.success = res.ok
            return res.json()
          })
          .then(data => {
            if (this.success)
              this.$alert(this.$t('confirmed'))
            else
              this.$alert(this.$t(data.message))
          })
    }
  },
  mounted() {
    if (!this.$store.state.login) {
      this.$alert(this.$t('require-login'))
      router.push({name: 'Login'})
      return
    }

    this.fetchFriends()
    this.$store.commit('refresh')
  }
}
</script>

<style scoped>

.user-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.user-title-username {
  margin: 0 20px;
  font-size: 25px;
  font-weight: bold;
  color: #303133
}

.recharge-panel {
  width: 800px;
}

.artwork-card {
  width: 95% !important;
}


</style>
