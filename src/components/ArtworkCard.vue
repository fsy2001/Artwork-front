<template>
  <el-card class="artwork-card" :body-style="{ padding: '0px' }">
    <el-image fit="cover" :src="artwork.imgPath" class="art-card-img"></el-image>

    <div class="art-card-info">
      <h2 class="art-card-title">
        <router-link class="art-card-title-text" :to="'/artwork/' + artwork.id">{{ artwork.title }}</router-link>
        <el-button v-if="cart" @click="removeFromCart" type="text" style="float: right">
          <i class="el-icon-delete"></i>
        </el-button>
      </h2>

      <el-divider></el-divider>
      <span class="art-card-detail">{{ $t('artwork-detail') }}</span>
      <p class="art-card-text">
        {{ $t('author') }}：{{ artwork.author }} <br>
        {{ $t('views') }}：{{ artwork.view }} <br>
        {{ $t('price') }}：{{ artwork.price }}
      </p>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "ArtworkCard",
  props: ['artwork', 'cart'],
  methods: {
    removeFromCart: function () {

    }
  }
}
</script>

<style scoped>

.artwork-card {
  padding: 0 !important;
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 25px;
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

</style>
