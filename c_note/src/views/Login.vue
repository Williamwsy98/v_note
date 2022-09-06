<template>
    <form>
        <fieldset>
            <legend>登录</legend>
            <label for="username">用户名：</label>
            <input type="text" id="username" v-model='unv' ref='uname' @click='select(0)' @keydown.enter.prevent='next' class='inp'>
            <label for="password">密码：</label>
            <input type="password" id="password" v-model='pwv' ref='pwd' @click='select(1)' @keydown.enter.prevent='next(0)' class='inp'>
            <div class='check_container'>
                <input type="checkbox" id="is_memory" v-model='isMemory' class='check'>
                <span>记住我</span>
            </div>
            <input type="button" id='submit' value='确定' @click='login' class='inp btn'> 
            <input type='button' value='没有账号？去注册' @click='r_push("register")' class=' inp btn'>
        </fieldset>
    </form>
</template>

<script>
import {mapMutations} from 'vuex'
import {axGet} from '../ax/ax'
    export default {
        data() {
            return {
                unv:'',
                pwv:'',
                index:0,
                flag:true,
                isMemory:false
            }
        },
        methods:{
            ...mapMutations(['r_push','getinfo','save_id','save_mail']),
            select(option) {
                this.index = option
                if(option)
                    this.$refs.pwd.focus()
                else
                    this.$refs.uname.focus()      
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
                        if(this.pwv==''){
                            alert('密码不能为空')
                            this.select(1)
                            this.flag = false
                        }else if(!key) this.login()
                }
            },
            login(){
                this.index = 0
                this.flag = true
                for (let i = 0; i < 2; i++) {
                    this.next(1)
                    if(!this.flag) return                   
                }
                let obj = {
                    path:'index.php?c=login&a=login',
                    content:{
                        uname:this.unv.trim(),
                        upwd:this.pwv,
                        is_memory:this.isMemory?1:0
                    }
                }
                axGet(obj)
                .then((res)=>{
                    switch(res.data.occasion){
                        case 0:
                            alert('用户不存在')
                            this.select(0)
                            break
                        case 1:
                            alert('密码错误')
                            this.select(1)
                            break
                        case 2:
                            alert('账号尚未激活,已向您的邮箱重新发送激活码')
                            this.save_id(res.data.uid)
                            this.save_mail(res.data.address)
                            this.r_push('confirm')
                            break
                        default:
                            alert('登录成功')
                            this.getinfo(res.data.info)
                            this.r_push('menu')
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