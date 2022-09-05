<template>
    <div class='menu'>
        <div class='head'>欢迎登录，{{user.uname}}！</div>
        <div class='mbox'>
            <div class='m_btn' @click='access'>进入我的笔记</div>
            <div class='m_btn' @click='logout'>登出</div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
export default {
    computed:{
        ...mapState(['user','notes'])
    },
    methods:{
        ...mapMutations(['access','quit']),
        logout(){
            let cf = confirm('确定要登出吗？')
            if(cf){
                this.quit()
            }
        }
    }
}
</script>