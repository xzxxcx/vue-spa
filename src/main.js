import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/base.css'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
