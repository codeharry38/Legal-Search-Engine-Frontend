import Vue from 'vue'
import { SERVER_API } from './API'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueRouter from 'vue-router';
import Route from './router';
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import './assets/css/main.css';
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false;
Vue.prototype.$api = SERVER_API;
Vue.prototype.$bus  = new Vue();

const router = new VueRouter({
  routes: Route,
  mode: 'history'
})
export const bus  = new Vue();
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
