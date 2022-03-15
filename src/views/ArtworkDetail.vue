<template>
  <div class="page">
    <el-card class="page-box">
      <div class="page-title-box">
        <h1 class="page-title">
          {{ artwork.title }}
        </h1>
      </div>

      <el-image class="artwork-image" fit="fill" :src="artwork.imgPath"></el-image>

      <el-descriptions :title="$t('artwork-detail')" border>

        <template slot="extra">
          <el-button @click="addToCart" :disabled="artwork.sold" v-if="$store.state.login" type="primary"
                     icon="el-icon-shopping-cart-full">
            {{ $t('add-to-cart') }}
          </el-button>
        </template>

        <el-descriptions-item :label="$t('sold')">
          {{ artwork.sold ? $t('true') : $t('false') }}`
        </el-descriptions-item>
        <el-descriptions-item :label="$t('price')">{{ artwork.price }}</el-descriptions-item>
        <el-descriptions-item :label="$t('views')">{{ artwork.view }}</el-descriptions-item>

        <el-descriptions-item :label="$t('author')">{{ artwork.author }}</el-descriptions-item>
        <el-descriptions-item :label="$t('era')">
          <el-tag size="small">{{ artwork.detailEra }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('genre')">
          <el-tag size="small">{{ artwork.detailGenre }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item :label="$t('year')">{{ artwork.detailYear }}</el-descriptions-item>
        <el-descriptions-item :label="$t('size')">{{ artwork.detailSize }}</el-descriptions-item>

      </el-descriptions>

    </el-card>


  </div>
</template>


<script>

export default {
  name: "ArtworkDetail",
  data() {
    return {
      artwork: {
        title: "",
        author: "",
        price: 0,
        view: 0,
        sold: false,
        imgPath: "/",
        detailYear: "",
        detailSize: "",
        detailGenre: "",
        detailEra: ""
      }
    }
  },
  mounted() {
    // 从服务器获取艺术品信息
    fetch('/api/artwork/browse/' + this.$route.params.id)
        .then(res => {
          this.success = res.ok
          return res.json()
        })
        .then(data => {
          if (this.success)
            this.artwork = data
          else
            this.$alert(this.$i18n.t(data.message))
        })
  },
  methods: {
    addToCart: function () { // 添加购物车
      fetch('/api/cart/add/' + this.$route.params.id, {
        method: 'POST'
      })
          .then(res => {
            this.success = res.ok
            if (!res.ok)
              return res.json()
          })
          .then(data => {
            if (this.success) { // 添加成功
              this.$alert(this.$i18n.t('cart-item-added'))
              this.refreshCart()
            } else { // 发生错误
              this.$alert(this.$i18n.t(data.message))
            }
          })
    },
    refreshCart: function () { // TODO: 刷新购物车数据

    }
  }
}
</script>


<style scoped>

.page-box {
  width: 500px;
  margin-top: 30px;
  padding: 40px;
}

.artwork-image {
  width: 100%;
  height: 300px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

</style>
