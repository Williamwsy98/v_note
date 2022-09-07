import Vue from 'vue'
import Vuex from 'vuex'
import $router from '../router'
import {axGet,axPost} from '../ax/ax'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:localStorage['user']?JSON.parse(localStorage['user']):null,
    obj:{},
    notes:localStorage['notes']?JSON.parse(localStorage['notes']):[],
    current:localStorage['current']?JSON.parse(localStorage['current']):{},
    route:localStorage['route']??'',
    reg_info:localStorage['reg_info']?JSON.parse(localStorage['reg_info']):null,
    inactive:localStorage['inactive']?JSON.parse(localStorage['inactive']):null,
    reg_id:localStorage['reg_id']??'',
    count:localStorage['count']??0,
    pageno:localStorage['pageno']??1
  },
  mutations: {
    init(s){
      s.obj = {
        path:'index.php',
        content:{
          c:'login',
          a:'hasSession',
          nid:s.current.id
        }
      }
      axGet(s.obj)
      .then((res)=>{
        if(res.data.session){
          if(!localStorage['user']) this.commit('getinfo',res.data.info)
        }else{
          if(localStorage['user']) this.commit('getinfo','')
        }
      })
    },
    r_push(s,path){
      $router.push({
        name:path
      })
    },
    getinfo(s,obj){
      s.user = obj
      localStorage['user'] = JSON.stringify(s.user)
    },
    // getnotes(s,obj){
    //   s.notes = []
    //   for(let i in obj){
    //     obj[i].fields.id = obj[i].pk
    //     s.notes.push(obj[i].fields)
    //   }
    // },
    getnotes(s,obj){
      s.notes = []
      for(let i in obj){
        s.notes.push(obj[i])
      }
    },
    to_edit(s,item){
      if(item) s.current = item
      s.route = item?'edit':''
      this.commit('r_push','edit')
      this.commit('save')
    },
    save(s){
      localStorage['route'] = s.route
      localStorage['current'] = JSON.stringify(s.current)
      localStorage['notes'] = JSON.stringify(s.notes)
    },
    access(){
      this.commit('to_page')
      this.commit('r_push','nf')
    },
    to_page(s,index){
      s.obj = {
        path:'index.php',
        content:{
          c:'notes',
          a:'render',
          pageno:index??1
        }
      }
      axGet(s.obj)
      .then((res)=>{
        // let result = JSON.parse(res.data.mynotes)
        s.pageno = res.data.page
        s.count = res.data.count
        this.commit('getnotes',res.data.mynotes)
        localStorage['notes'] = JSON.stringify(s.notes)
        localStorage['pageno'] = s.pageno
        localStorage['count'] = s.count
      })
    },
    upload(s,fd){
      s.obj = {
        path:'index.php?c=service&a=add',
        content:fd,
        config:s.config
      }
      axPost(s.obj)
      .then((res)=>{
        if(res){
          alert('上传成功')
          this.commit('access')
        }
      })
    },
    update_current(s,obj){
      s.current = obj
      for(let n in s.notes){
        if(s.notes[n].id==s.current.id){
          s.notes[n] = obj
          this.commit('save')
          break
        }
      }
    },
    del_note(s){
      let cf = confirm('确定要删除这篇笔记吗？')
      if(cf){
        s.obj = {
          path:'index.php',
          content:{
            c:'service',
            a:'del',
            nid:s.current.id
          }
        }
        axGet(s.obj)
        .then((res)=>{
          if(res){
            alert('删除成功')
            for(let n in s.notes){
              if(s.notes[n].id==s.current.id){
                s.notes.splice(n,1)
                break
              }
            }
            this.commit('r_push','nf')
          }
        })
      }
    },
    quit(s){
      s.obj = {
        path:'index.php',
        content:{
          c:'login',
          a:'load'
        }
      }
      axGet(s.obj)
      .then(()=>{
          s.notes = []
          localStorage.clear()
          this.commit('r_push','login')
      })
    },
    save_info(s,obj){
      s.reg_info = obj
      localStorage['reg_info'] = JSON.stringify(obj)
    },
    save_id(s,id){
      localStorage.clear()
      s.reg_id = id
      localStorage['reg_id'] = id
    },
    save_mail(s,address){
      s.inactive = {
        flag:true,
        address
      }
      localStorage['inactive'] = JSON.stringify(s.inactive)
    },
    toggle_flag(s){
      s.inactive.flag = !s.inactive.flag
      localStorage['inactive'] = JSON.stringify(s.inactive)
    }
  },
  actions: {
  },
  modules: {
  }
})
