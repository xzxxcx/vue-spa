import Vue from 'vue'
// 1引入安装好的 Vue-router
import Router from 'vue-router'
// 2引入定义好的 。vue后缀类型的文件
import Login from '../views/Login'
import Home from '../views/Home'
import Welcome from '../views/Home/welcome'
import Users from '../views/Home/users'

Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      }
    ]
  }]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router