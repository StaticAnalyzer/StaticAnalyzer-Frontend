import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '@/components/UserLogin.vue'
import UserInfo from '@/components/UserInfo.vue'
import UserRegister from '@/components/UserRegister.vue'
import ProjectUpload from '@/components/ProjectUpload'
import ResultsView from '@/components/ResultsView'
import DetailsView from '@/components/DetailsView'

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
      component: ProjectUpload
    },
    {
      path: '/result',
      component: ResultsView
    },
    {
      path: '/result/:id',
      component: DetailsView
    }
  ]
})

export default router
