import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import plugins from "./plugins";

const app = createApp(App);
app.use(router);
app.use(plugins.vuetify);
app.mount("#app");
