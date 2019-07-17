import Vue from 'vue'
import { Button, Input, Form, FormItem, Message } from 'element-ui'

Vue.use(Button)
  .use(Input)
  .use(Form)
  .use(FormItem)
  // .use(Message)
Vue.prototype.$message = Message
