<template>
  <div class="search-result container">
    <ul class="list-group w-75 mx-auto">
      <search-entity-comp
        v-for="entity in entities"
        :key="entity.data.id"
        :data="entity"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import SearchEntityComp from '@/components/SearchEntityComp.vue'
import { searchPeople } from '@/apis/searching'
import { SearchEntity } from '@/models/search'

@Component({
  components: {
    SearchEntityComp
  }
})
export default class SearchResult extends Vue {
  entities: SearchEntity[] = []

  async created() {
    this.setEntities()
  }

  async setEntities() {
    const res = await searchPeople(this.$route.params.text as string)
    Vue.set(this, 'entities', res)
  }
}
</script>

<style scoped lang="scss">
</style>
