<template>
  <div class="root">
    <img class="worm" :src="worm" />
    <h1>{{ projectName }}</h1>
  </div>
</template>

<script>
import worm from "./worm.svg";
export default {
  name: "App",
  props: ["projectName"],
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
