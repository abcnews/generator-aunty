import Vue from "vue";
const App = require("../App.vue");

describe("App", () => {
  it("should render correct contents", () => {
    const Constructor = Vue.extend(App);
    const vm = new Constructor({
      propsData: {
        projectName: "test-project"
      }
    }).$mount();
    expect(vm.$el.querySelector(".root h1").textContent).toEqual(
      "test-project"
    );
  });

  it("renders a snapshot", () => {
    const renderer = require("vue-server-renderer").createRenderer();
    const vm = new Vue({
      el: document.createElement("div"),
      render: h =>
        h(App, {
          props: {
            projectName: "test-project"
          }
        })
    });
    renderer.renderToString(vm, (err, str) => {
      console.log(str);
      expect(str).toMatchSnapshot();
    });
  });
});
