import Vue from "vue";
import App from "./components/App.vue";

const PROJECT_NAME = "<%= projectSlug %>";

new Vue({
  el: `[data-${PROJECT_NAME}-root]`,
  render: h => h(App)
});
