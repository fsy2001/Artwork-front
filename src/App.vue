<template>
  <div id="app">
    <Navigator/>
    <el-main>
      <router-view/>
    </el-main>
  </div>
</template>

<script>
import Navigator from "@/components/Navigator";

export default {
  components: {Navigator}
}
</script>

<style lang="scss">

.el-main {
  padding: 0 !important;
}

html {
  height: 100%;
  margin: 0;
}

body {
  height: 100%;
  margin: 0;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}


.page {
  width: 100%;
  display: flex;
  justify-content: center;
}

.page-box {
  width: 500px;
  margin-top: 30px;
  padding: 40px;
}

.page-title-box {
  display: flex;
  justify-content: center;
}

.page-title {
  margin: 0;
}


</style>
