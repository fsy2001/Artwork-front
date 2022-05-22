<template>
  <div class="page">
    <el-card class="page-box">
      <div class="page-title-box">
        <h1 class="page-title">
          {{ artwork.title }}
        </h1>
      </div>

      <el-image class="artwork-image" fit="cover" :src="artwork.imgPath"
                @mouseenter="enhanceVisible = true"
                @mousemove="enhance"
                @mouseleave="enhanceVisible = true">
      </el-image>

      <!--   悬浮放大窗口   -->
      <div class="enhance-hover-box" v-show="enhanceVisible" :style="positionObject"></div>

      <el-descriptions :title="$t('artwork-detail')" border>

        <template slot="extra">
          <el-button @click="addToCart" :disabled="artwork.sold" v-if="$store.state.login" type="primary"
                     icon="el-icon-shopping-cart-full">
            {{ $t('add-to-cart') }}
          </el-button>
        </template>

        <el-descriptions-item :label="$t('sold')">
          {{ artwork.sold ? $t('true') : $t('false') }}
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
      },
      enhanceVisible: false,
      positionObject: {
        top: '0px',
        left: '0px',
        backgroundImage: '',
        backgroundPosition: '0px 0px'
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
          if (this.success) {
            this.artwork = data
            this.positionObject.backgroundImage = `url(${this.artwork.imgPath})` // 设置放大 div 的背景图片
          } else
            this.$alert(this.$i18n.t(data.message))
        })
    if (this.$store.state.login)
      this.$store.commit('history') // 刷新浏览历史记录

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
              this.$store.commit('cart') // 刷新购物车
            } else { // 发生错误
              this.$alert(this.$i18n.t(data.message))
            }
          })
    },
    enhance: function (event) {
      this.positionObject.left = (event.clientX + 50) + 'px'
      this.positionObject.top = (event.clientY + 50) + 'px'
      this.positionObject.backgroundPosition = `${-event.offsetX}px ${-event.offsetY}px`
    },
  }
}
</script>


<style scoped>

.artwork-image {
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.enhance-hover-box {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 10px;
  box-shadow: 0 0 .25rem rgba(95, 95, 95, .48);
  background-size: 700px;
}

</style>
