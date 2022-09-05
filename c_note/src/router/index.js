import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register')
  },
  {
    path:'/menu',
    name:'menu',
    component:() => import('../views/Menu')
  },
  {
    path:'/nf',
    name:'nf',
    component:() => import('../views/Note_form.vue')
  },
  {
    path:'/edit',
    name:'edit',
    component:() => import('../views/Edit.vue')
  },
  {
    path:'/mail',
    name:'mail',
    component:() => import('../views/Mail.vue')
  },
  {
    path:'/confirm',
    name:'confirm',
    component:() => import('../views/Confirm.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to)=>{
  let initial = ['login','register','mail','confirm']
  if(to.name){
    if(initial.indexOf(to.name)==-1) {
      if(!localStorage['user']) router.push({name:'login'})
    }else{
      if(localStorage['user']){
        router.push({name:'menu'})
      }else{
        if(to.name=='mail'&&(!localStorage['reg_info'])) router.push({name:'login'})
        if(to.name=='confirm'&&(!localStorage['inactive'])) router.push({name:'login'})
      }
    }
  }else router.push({name:localStorage['user']?'menu':'login'})
})

export default router

