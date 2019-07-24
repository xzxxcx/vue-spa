import Vue from 'vue'
import App from './App.vue'
// 引入路由文件
import router from './router'
// 引入初始样式
import './assets/css/base.css'
// 引入element插件
import './plugins/element.js'
import './assets/fonts/iconfont.css'
// 引入第三方表格树形控件
import tableTree from 'vue-table-with-tree-grid'
// 引入axios请求
import './api'
Vue.component('table-tree', tableTree)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
