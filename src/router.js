import Vue from 'vue'
// 1引入安装好的 Vue-router
import Router from 'vue-router'
// 2引入定义好的 。vue后缀类型的文件
import Login from './views/Login'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/login',
    component: Login
  }, {
    path: '/',
    component: Login
  }]
})
