<template>
  <div class="svg"></div>
</template>

<script>
const d3 = require("d3-selection");

export default {
  name: "<%= className %>",
  mounted() {
    const svg = d3
      .select(".svg")
      .append("svg")
      .attr("width", 400)
      .attr("height", 300);

    const g = svg.append("g").attr("fill", "black");

    const rect = g
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("width", 400)
      .attr("height", 300);
  },
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
