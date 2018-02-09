<template>
  <div class="root">
    <code>Error: {{ errorMessage }}</code>
  </div>
</template>

<script>
export default {
  name: "App",
  props: ["errorMessage"],
  data() {
    return {};
  }
};
</script>

<style src="./ErrorBox.css" lang="css" scoped></style>

<style lang="scss" scoped>
// Component styles here
</style>
