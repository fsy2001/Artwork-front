<template>
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

