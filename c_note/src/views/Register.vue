<template>
    <form>
        <fieldset>
            <legend>注册</legend>
            <label for="username">用户名：</label>
            <input type="text" id="username" v-model='unv' ref='uname' @click='select(0)' @keydown.enter.prevent='next' class='inp'>
            <label for="password">密码：</label>
            <input type="password" id="password" v-model='pwv' ref='pwd' @click='select(1)' @keydown.enter.prevent='next' class='inp'>
            <label for="confirm">确认密码：</label>
            <input type="password" id="confirm" v-model='cfv' ref='cfm' @click='select(2)' @keydown.enter.prevent='next(0)' class='inp'>
            <input type="button" id='submit' value='确定' @click='register' class='inp btn'>  
            <input type='button' value='已有账号？去登录' @click='r_push("login")' class='inp btn'>
        </fieldset>
    </form>
</template>

<script>
import {mapMutations} from 'vuex'
import {axGet} from '../ax/ax'
// import mm from 'moment'
    export default {
        data() {
            return {
                unv:'',
                pwv:'',
                cfv:'',
                index:0,
                flag:true
            }
        },
        methods:{
            ...mapMutations(['r_push','save_info']),
            select(option) {
                this.index = option
                switch(option){
                    case 0:
                        this.$refs.uname.focus()
                        break;
                    case 1:
                        this.$refs.pwd.focus()
                        break;
                    case 2:
                        this.$refs.cfm.focus()
                }
            },
            next(key) {
                switch (this.index) {
                    case 0:
                        if(this.unv.trim()==''){
                            alert('用户名不能为空')
                            this.select(0)
                            this.flag = false
                        }else this.select(1)
                        break
                    case 1:
                        if(this.pwv.length<7){
                            alert('密码不能小于七位')
                            this.select(1)
                            this.flag = false
                        }else this.select(2)
                        break
                    case 2:
                        if(this.cfv!=this.pwv){
                            alert('两次密码输入必须一致')
                            this.select(2)
                            this.flag = false
                        }else if(!key) this.register()
                }
            },
            register(){
                this.index = 0
                this.flag = true
                for (let i = 0; i < 3; i++) {
                    this.next(1)
                    if(!this.flag) return                   
                }
                let obj = {
                    path:'api/cloudnote/dup',
                    content:{
                        uname:this.unv.trim(),
                        upwd:this.pwv
                    }
                }
                axGet(obj)
                .then((res)=>{
                    if(res.data.occasion){
                        this.save_info(res.data.info)
                        this.r_push('mail')
                    }else{
                        alert('此用户名已注册')
                        this.select(0)
                    }
                })
            }
        },
        mounted(){
            this.$refs.uname.focus()
        },
        beforeRouteEnter(to,from,next){
            localStorage['reg_info'] = ''
            localStorage['inactive'] = ''
            next()
        }
    }
</script>