<template>
  <div class="message">
    <div class="message-user">
      <el-avatar :size="30" :src="message.from.img"></el-avatar>
      <span class="message-username">{{ message.from.username }}</span>
      <span class="message-date">{{ message.date }}</span>
    </div>
    <div class="message-content">
      {{ message.content }}
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: ['message']
}
</script>

<style scoped>

.message-user {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

.message-username {
  margin-left: 20px;
}

.message-date {
  font-size: smaller;
  color: #909399;
  margin-left: 1em;
}

.message-content {
  text-align: right;
}

</style>
