<template>
  <div class="page">
    <el-card class="page-box">
      <div slot="header" class="page-title-box">
        <h1 class="page-title">
          {{ $t('chatroom') }}
        </h1>
      </div>
      <el-form :inline="true">
        <el-form-item :label="$t('message')">
          <el-input v-model="content" :placeholder="$t('message-prompt')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="sendMessage" type="primary">{{ $t('send') }}</el-button>
        </el-form-item>
      </el-form>

      <Message v-for="(message, idx) in messages" :key="idx" :message="message"></Message>
    </el-card>
  </div>

</template>

<script>
import Message from "@/components/Message";
import router from "@/router";

export default {
  name: "Chat",
  components: {Message},

  data: function () {
    return {
      messages: [],
      content: '',
      socket: null
    }
  },
  methods: {
    getSocket: function () {
      let socket = new WebSocket('ws://192.168.3.53/api/chat')
      socket.onopen = function (event) {
        console.log('connection opening')
        console.log(event)
      }
      socket.onmessage = this.pushMessage
      socket.onclose = function (event) {
        console.log('connection closing')
        console.log(event)
      }
      this.socket = socket
    },
    sendMessage: function () {
      let messageObj = {
        from: this.$store.state.user,
        date: new Date().toLocaleString(),
        content: this.content
      }
      this.socket.send(JSON.stringify(messageObj))
      this.content = ''
    },
    pushMessage: function (event) {
      let messageObj = JSON.parse(event.data)
      this.messages.push(messageObj)
      if (this.messages.length > 5) // 聊天数目上限
        this.messages.shift()
    }

  },
  mounted() {
    if (!this.$store.state.login) {
      this.$alert(this.$t('require-login'))
      router.push({name: 'Login'})
      return
    }

    this.getSocket()
  },
  destroyed() {
    this.socket.close()
  }

}
</script>

<style scoped>

</style>
