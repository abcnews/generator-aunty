import Vue from "vue";
import d3 from "d3-selection";
const <%= className %> = require("../<%= className %>.vue");

describe("<%= className %>", () => {
  it("renders a snapshot", () => {
    const renderer = require("vue-server-renderer").createRenderer();
    const vm = new Vue({
      el: document.createElement("div"),
      render: h =>
        h(<%= className %>, {
          props: {
            projectName: "test-project"
          }
        })
    });
    renderer.renderToString(vm, (err, str) => {
      expect(str).toMatchSnapshot();
    });
  });
});
