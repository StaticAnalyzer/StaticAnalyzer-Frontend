import { createRouter, createWebHistory } from 'vue-router'
import FileUpload from '@/components/FileUpload'
import UserLogin from '@/components/UserLogin.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserRegister from '@/components/UserRegister.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/user/login"
    },
    {
      path: "/user",
      redirect: "/user/info",
      children:[
        {
          path: "login",
          component: UserLogin
        },
        {
          path: "register",
          component: UserRegister
        },
        {
          path: "info",
          component: UserInfo
        },
      ]
    },
    {
      path: '/upload',
      component: FileUpload
    }
  ]
})

export default router
