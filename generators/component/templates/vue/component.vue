<template>
  <div class="wrapper">
    Find me in <strong>src/components/<%= className %>.js</strong>
  </div>
</template>

<script>
export default {
  name: "<%= className %>",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  border: 1px solid rgb(255, 115, 0);
  padding: 20px;
  text-align: center;
  color: black;
}
</style>
