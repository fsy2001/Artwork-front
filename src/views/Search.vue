<template>
  <div class="page">
    <el-card class="page-box">
      <div slot="header" class="page-title-box">
        <h1 class="page-title">
          {{ $t('search') }}
        </h1>
      </div>

      <el-input :placeholder="$t('search-content-prompt')" v-model="searchWord">
        <el-select v-model="searchType" slot="prepend" style="width:100px">
          <el-option :value="'title'" :label="$t('by-title')"></el-option>
          <el-option :value="'author'" :label="$t('by-author')"></el-option>
        </el-select>
        <el-button @click="search" slot="append" icon="el-icon-search" style="width: 55px"></el-button>
      </el-input>

      <el-table :data="searchResult">
        <el-table-column prop="title" :label="$t('title')" sortable></el-table-column>
        <el-table-column prop="price" :label="$t('price')" sortable></el-table-column>
        <el-table-column prop="view" :label="$t('views')" sortable></el-table-column>

        <el-table-column type="expand">
          <template slot-scope="slot">
            <ArtworkCard :artwork="slot.row" :cart="false"></ArtworkCard>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

</template>

<script>
import ArtworkCard from "@/components/ArtworkCard";

export default {
  name: "Search",
  components: {ArtworkCard},

  data() {
    return {
      searchWord: '',
      searchType: 'title',
      searchResult: []
    }
  },
  methods: {
    search: function () {
      let query = "/api/artwork/search?" + this.searchType + "=" + this.searchWord

      fetch(query)
          .then(res => {
            this.success = res.ok
            return res.json()
          })
          .then(data => {
            if (this.success)
              this.searchResult = data
            else
              this.$alert(this.$i18n.t(data.message))
          })
    }
  }
}
</script>

<style scoped>

</style>
