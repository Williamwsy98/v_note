<template>
    <form>
        <fieldset>
            <legend>{{this.inactive.flag?'激活账号':'修改邮箱'}}</legend>
            <label for='code'>{{this.inactive.flag?'输入激活码':'修改邮箱地址'}}：</label>
            <input type="text" id="code_address" ref='code' @keydown.enter.prevent='submit' class='inp' :value="this.inactive.flag?'':this.inactive.address">
            <input type="button" id='submit' :value="inactive.flag?'确定':'发送'" @click='submit' class='inp btn'>
            <input type="button" id='resend' :value="inactive.flag?'重新发送':'返回'" @click='toggle' class='inp btn'>  
        </fieldset>
    </form>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {axGet} from '../ax/ax'
    export default {
        computed:{
            ...mapState(['inactive','reg_id'])
        },
        methods:{
            ...mapMutations(['r_push','save_mail','toggle_flag']),
            activate(){
                if(!this.$refs.code.value.trim()){
                    alert('不能为空')
                    this.$refs.code.focus()
                }else {
                    let obj = {
                        path:'api/cloudnote/activate',
                        content:{
                            uid:this.reg_id,
                            code:this.$refs.code.value
                        }
                    }
                    axGet(obj)
                    .then((res)=>{
                        if(res.data.occasion){
                            alert('激活成功')
                            this.r_push('login')
                        }else {
                            alert('激活失败')
                            this.$refs.code.value = ''
                            this.$refs.code.focus()
                        }
                    })
                }
            },
            toggle(){
                this.toggle_flag()
                this.$refs.code.focus() 
            },
            resend(){
                if(this.$refs.code.value.match(/^([a-zA-Z0-9]+[-_\\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/)) {
                    let obj = {
                        path:'api/cloudnote/set_mail',
                        content:{
                            uid:this.reg_id,
                            address:this.$refs.code.value
                        }
                    }
                    axGet(obj)
                    .then((res)=>{
                        if(res.data.occasion){
                            alert('已发送')
                            this.save_mail(this.$refs.code.value)
                        }else{
                            alert('此邮箱地址已被其他用户绑定')
                            this.$refs.code.focus()
                        }
                    })
                }else{
                    alert('邮箱格式不正确')
                    this.$refs.code.focus()
                }
            },
            submit(){
                if(this.inactive.flag) this.activate()
                else this.resend()
            }
        },
        mounted(){
            this.$refs.code.focus()
        }
    }
</script>