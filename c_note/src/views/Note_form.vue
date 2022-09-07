<template>
    <div class='menu'>
        <div class='head'>{{user.uname}}的笔记</div>
        <div class='nfbox'>
            <div class='nf' v-if='notes.length'>
                <table border="1" cellspacing="10">
                    <tr>
                        <th>标题</th>
                        <th>创建时间</th>
                        <th>最近更新</th>
                    </tr>
                    <tr v-for='item,index in notes' :key='index'>
                        <td><span @click='to_edit(item)'>{{item.title}}</span></td>
                        <td>{{format(item.created_time)}}</td>
                        <td>{{format(item.updated_time)}}</td>
                    </tr>
                </table>
            </div>
            <div class='empty' v-if='!notes.length'>空空如也</div>
            <div class='nf_btns'>
                <div class='nf_btn' @click='to_edit(0)'>添加笔记</div>
                <div class='nf_btn' @click='cg_page(pageno-1)' v-if='pageno!=1'>上一页</div>
                <span>第</span>
                <input class='pg' type='text' :value='pageno' @keydown.enter.prevent='cg_page($refs.pageno.value)' ref='pageno'>
                <span>/{{this.count}}页</span>
                <div class='nf_btn' @click='cg_page(Number(pageno)+1)' v-if='pageno!=count'>下一页</div>
                <div class='nf_btn' @click='r_push("menu")'>返回</div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import mm from 'moment'
export default {
    computed:{
        ...mapState(['notes','current','user','count','pageno']),
    },
    methods:{
        ...mapMutations(['r_push','to_edit','to_page']),
        format(time){
            return mm(time).format('YYYY-MM-DD hh:mm')
        },
        cg_page(index){
            this.to_page(index)
        }
    },
}
</script>

<style scoped>
    .empty {
        width:30vw;
        background:#fff;
        font-size:20px;
        font-weight:bold;
        color:#ccc;
        text-align:center;
    }
    .menu .nf_btns {
        /* border:1px solid red; */
        display:flex;
        align-items:center;
        justify-content:center;
    }
    .menu .nf_btns .nf_btn {
        margin:0 5px 0 5px;
        height:25px;
    }
    .pg {
        width:20px;
    }
    span {
        margin:0 2px 0 2px;
        font-size:15px;
        color:#000;
    }
</style>