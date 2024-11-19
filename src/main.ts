import { createApp } from "vue";
import "./style.scss";
import store from "./store/store";
import App from "./App.vue";
import routes from "./routes/routes";
import "vue3-google-oauth2";

const app = createApp(App);

app.use(store).use(routes).mount("#app");
