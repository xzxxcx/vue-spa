import Vue from 'vue'
import {
  Button,
  Input,
  Form, FormItem,
  Message,
  Container,
  Header,
  Aside,
  Menu,
  Submenu,
  MenuItem,
  Main } from 'element-ui'

Vue.use(Button)
  .use(Input)
  .use(Form)
  .use(FormItem)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)

// .use(Message)
Vue.prototype.$message = Message
