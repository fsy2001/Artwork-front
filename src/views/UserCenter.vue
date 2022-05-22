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
        <el-button @click="refresh" style="margin-right: 10px">{{ $t('refresh') }}</el-button>
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

            <el-table-column :label="$t('recent-message')" prop="recentMessage"></el-table-column>
            <el-table-column align="right">
              <template slot="header">
                <el-button @click="visible.newFriends = true" size="mini">{{ $t('new-friends') }}</el-button>
                <el-button @click="visible.friendApply = true; fetchApplications()"
                           size="mini">{{ $t('friend-apply') }}
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
          <OrderCard v-for="order in $store.state.orders" :key="order.id" :order="order"></OrderCard>
        </el-collapse-item>

        <!--  最近浏览  -->
        <el-collapse-item :title="$t('recent-view')">
          <ArtworkCard v-for="artwork in $store.state.viewHistory" :key="artwork.id" :artwork="artwork" :cart="false"/>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <!--  充值面板  -->
    <el-dialog class="recharge-panel" :title="$t('recharge')" :visible.sync="visible.recharge">
      <el-form>
        <el-form-item :label="$t('recharge-amount')">
          <el-input v-model="rechargeValue" style="width: 100px"></el-input>
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
        recharge: false,
        newFriends: false,
        friendApply: false,
        message: false,
      },
      rechargeValue: 0,
      newFriendName: "",
    }
  },
  methods: {
    refresh: function () { // 刷新信息
      this.fetchFriends()
      this.$store.commit('refresh')
      this.$store.commit('order')
      this.user = this.$store.state.user
    },
    recharge: function () { // 提交充值数据
      if (!/^[0-9]+$/.test(this.rechargeValue)) {
        this.$alert('请输入合法数字')
        return
      }

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
              this.refresh()
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
  },
  mounted() {
    if (!this.$store.state.login) {
      this.$alert(this.$t('require-login'))
      router.push({name: 'Login'})
      return
    }

    this.fetchFriends()
    this.$store.commit('refresh')
    this.$store.commit('order')
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
