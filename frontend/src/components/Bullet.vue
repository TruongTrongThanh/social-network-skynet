<template>
  <router-link
    :to="route"
    tag="div"
    class="bullet d-flex align-items-center pr-3 clickable"
  >
    <img :src="imgSrc" class="image mr-3">
    <div class="name">{{ name }}</div>
    <slot/>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Route } from 'vue-router'

@Component
export default class Bullet extends Vue {
  @Prop({ type: String, required: true }) readonly imgSrc!: string
  @Prop({ type: String, required: true }) readonly name!: string
  @Prop({ type: Object, required: true }) readonly route!: Route
}
</script>

<style scoped lang="scss">
.bullet {
  &:hover {
    background-color: #ebebeb;
  }
  .image {
    width: 30px;
    height: 30px;
    object-fit: cover;
    border-radius: 50%;
  }
  .name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
