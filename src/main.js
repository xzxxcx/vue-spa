import Vue from 'vue'
import App from './App.vue'
// 引入路由文件
import router from './router'
// 引入初始样式
import './assets/css/base.css'
// 引入element插件
import './plugins/element.js'
import './assets/fonts/iconfont.css'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入第三方表格树形控件
import tableTree from 'vue-table-with-tree-grid'
// 引入axios请求
import './api'
Vue.use(VueQuillEditor)
Vue.component('table-tree', tableTree)
Vue.config.productionTip = false
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
