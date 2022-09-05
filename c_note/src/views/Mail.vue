<template>
    <form>
        <fieldset>
            <legend>邮箱</legend>
            <label for='email' v-if='!reg_info.address'>邮箱地址：</label>
            <input type="text" id="address" v-model='eav' ref='mail' @keydown.enter.prevent='send' class='inp' v-if='!reg_info.address'>
            <input type="button" id='submit' value='确定' @click='send' class='inp btn'>  
            <input type='button' value='上一步' @click='r_push("register")' class='inp btn'>
        </fieldset>
    </form>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {axPost} from '../ax/ax'
    export default {
        data() {
            return {
                eav:''
            }
        },
        computed:{
            ...mapState(['reg_info'])
        },
        methods:{
            ...mapMutations(['r_push','save_mail','save_id']),
            send(){
                if(this.eav.match(/^([a-zA-Z0-9]+[-_\\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/)) {
                    let cf = confirm('确定要注册吗？')
                    if(cf){
                        let obj = {
                            path:'api/cloudnote/register',
                            content:{
                                uname:this.reg_info.uname,
                                upwd:this.reg_info.upwd,
                                address:this.eav
                            }
                        }
                        axPost(obj)
                        .then((res)=>{
                            switch(res.data.occasion){
                                case 0:
                                    alert('此邮箱地址已被其他用户绑定')
                                    this.$refs.mail.focus()
                                    break
                                case 1:
                                    alert('此用户名已被注册')
                                    this.r_push('register')
                                    break
                                case 2:
                                    alert('已向您的邮箱发送激活邮件')
                                    this.save_id(res.data.uid)
                                    this.save_mail(this.eav)
                                    this.r_push('confirm')
                            }
                        })
                    }
                }else{
                    alert('邮箱格式不正确')
                    this.$refs.mail.focus()
                }
            }
        },
        mounted(){
            this.$refs.mail.focus()
        }
    }
</script>