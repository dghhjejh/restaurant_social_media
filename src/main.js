import { createApp } from "vue";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import { VDateInput, VTimePicker } from "vuetify/lib/labs/components.mjs";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "leaflet/dist/leaflet.css";

import router from "./router";

import App from "./App.vue";

import "@/assets/app.css";

import store from "@/store/index";

const vuetify = createVuetify({
  components: {
    VDateInput,
    VTimePicker,
    ...components,
  },
  directives,
});

createApp(App).use(router).use(vuetify).use(store).mount("#app");
