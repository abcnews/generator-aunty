<template>
  <div class="root">
    <img class="worm" :src="worm" />
    <h1>{{ projectName }}</h1>
    <!-- <new-component></new-component> -->
  </div>
</template>

<script>
import worm from "./worm.svg";
// import NewComponent from "./NewComponent.vue";

export default {
  name: "App",
  props: ["projectName"],
  // components: {
  //   "new-component": NewComponent
  // },
  data() {
    return {
      worm: worm
    };
  }
};
</script>

<style src="./App.scss" lang="scss" scoped></style>

<style lang="scss" scoped>
// Component styles here
</style>
