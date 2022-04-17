<template>
  <div>
    <div class="page">
      <el-card class="page-box">
        <div slot="header" class="page-title-box">
          <h1 class="page-title">
            {{ $t('trending') }}
          </h1>
        </div>

        <div class="home-body">
          <ArtworkCard v-for="artwork in artworkList" :key="artwork.id" :artwork="artwork" :cart="false"/>
        </div>
      </el-card>
    </div>
    <footer class="foot">
      <div class="foot-content">
        <span class="copyright-info">© 2022 fsy2001</span>
      </div>
    </footer>
  </div>

</template>

<script>
import ArtworkCard from "@/components/ArtworkCard";

export default {
  name: 'Home',
  components: {ArtworkCard},
  data() {
    return {
      artworkList: []
    }
  },
  mounted() {
    fetch("/api/artwork/top")
        .then(res => {
          this.success = res.ok
          return res.json()
        })
        .then(data => {
          if (this.success)
            this.artworkList = data
          else
            this.$alert(this.$i18n.t(data.message))
        })
  }
}
</script>

<style lang="scss">

.foot {
  margin-top: 50px;
  width: 100%;
  height: 100px;
  background-color: #f7fbfd;

  display: flex;
  justify-content: center;
}

.foot-content {
  width: 580px;
  padding-top: 20px
}

.copyright-info {
  font-weight: bold;
  color: #777
}

</style>
