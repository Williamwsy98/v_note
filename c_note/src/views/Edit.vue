<template>
    <div class='wrapper'>
        <div class='e_wrapper' :class='{beneath:currentImg}'>
            <div class='e_item nor'>
                <label>标题：</label>
                <input type='text' ref='title' v-model='title' @click='t_select(0)' @keydown.enter.prevent='next' :disabled='!isCreate&&(!isEdit)'>
                <div class='e_btn ef_btn' @click='submit'>{{this.btn_v}}</div>
                <div class='e_btn ef_btn' @click='toggle' v-if='!isCreate&&isEdit'>取消</div>
            </div>
            <div class='e_item'>
                <label>内容：</label>
                <div class="tarea" :contenteditable="isCreate||isEdit" ref='content' @click='t_select(1)' @keydown.enter.prevent='next(0)'>{{this.route?this.current.content:''}}</div>
            </div>
            <div class='e_item' v-if='ilist.length'>
                <label>图片：</label>
                <div class="files" ref='fcontainer'>
                    <div class='file' :class='{del:item.isSelected}' v-for='item,index in ilist' :key='index' :name='item.fields.name' @click='f_event(item,1)'>
                        <img :src='item.fields.src'>
                    </div>
                </div>
            </div>
            <div class='e_item' v-if='flist.length'>
                <label>附件：</label>
                <div class="files" ref='fcontainer'>
                    <div class='file' :class='{del:item.isSelected,cp:isEdit}' v-for='item,index in flist' :key='index' :name='item.fields.name' @click='f_event(item)'>
                        <img class='icon' src="/file.webp">
                        <a :href="item.fields.src" :download='item.fields.name' v-if='!isEdit'><span>{{item.fields.name}}</span></a>
                        <span v-if='isEdit'>{{item.fields.name}}</span>
                    </div>
                </div>
            </div>
            <div class='e_item' v-if='isEdit||isCreate'>
                <label>上传：</label>
                <div class="files" ref='fcontainer'>
                    <div class='file' :class='{selected:item.isSelected}' v-for='item,index in file_list' :key='index' :name='item.name' @click='f_select(item)'>
                        <img :class='{icon:!item.src}' :src='item.src?item.src:"/file.webp"'>
                        <span v-if='!item.src'>{{item.name}}</span>
                    </div>
                </div>
                <div class='e_btn ef_btn' @click='$refs.myfiles.click()'>选择文件</div>
                <div class='e_btn ef_btn' @click='del' v-if='file_list.length'>删除文件</div>
                <input type='file' ref='myfiles' v-show='false' @change='insert'>
            </div>
            <div class='e_item nor'>
                <div class='e_btn normal' v-if='isEdit' @click='del_note'>删除</div>
                <div class='e_btn normal' @click='$router.back()'>返回</div>
            </div>
        </div>
        <div class='cover' @click='toggle_screen(0)' v-if='currentImg'>
            <img class='screen' :src='currentImg'>
        </div>
    </div>
</template>

<script>
import {mapState,mapMutations} from 'vuex'
import {axGet,axPost} from '../ax/ax'
export default {
    data(){
        return {
            title:'',
            btn_v:'上传',
            reader:new FileReader(),
            file_list:[],
            obj:{},
            obj1:{},
            type:'',
            flag:true,
            f_index:0,
            isEdit:false,
            t_index:0,
            currentImg:'',
            currentID:0,
            ilist:[],
            flist:[],
            idel:[],
            fdel:[],
            config:{
                headers:{'Content-Type':'multipart/form-data'}
            } 
        }
    },
    computed:{
        ...mapState(['user','current','route']),
        isCreate(){
            return !this.route
        }
    },
    methods:{
        ...mapMutations(['d_select','upload','update_current','del_note']),
        init(flag){
            this.ilist = []
            this.flist = []
            this.file_list = []
            if(this.route){
                if(flag){
                    this.btn_v = '编辑'
                    this.isEdit = false
                }
                this.obj = {
                    path:'index.php',
                    content:{
                        c:'edit',
                        a:'render',
                        nid:this.current.id
                    }
                }
                axGet(this.obj)
                .then((res)=>{
                    this.update_current(res.data.note)
                    this.title = this.current.title
                    // this.obj = JSON.parse(res.data.images)
                    this.obj = res.data.images
                    for(let i in this.obj){
                        this.obj1 = {
                            id:this.obj[i].id,
                            fields:this.obj[i],
                            isSelected:false
                        }
                        this.ilist.push(this.obj1)
                    }
                    // this.obj = JSON.parse(res.data.files)
                    this.obj = res.data.files
                    for(let f in this.obj){
                        this.obj1 = {
                            id:this.obj[f].id,
                            fields:this.obj[f],
                            isSelected:false
                        }
                        this.flist.push(this.obj1)
                    }
                })
            }
        },
        insert(){
            if(this.$refs.myfiles.files[0]){
                this.obj = {
                    name:this.$refs.myfiles.files[0].name,
                    file:this.$refs.myfiles.files[0],
                    isSelected:false
                }
                this.type = this.$refs.myfiles.files[0].type
                this.reader.readAsDataURL(this.$refs.myfiles.files[0])
                this.reader.onload = ()=>{
                    if(this.type.match('image')){
                        this.obj.src = this.reader.result
                    }
                    this.file_list.push(this.obj)
                }
                this.$refs.myfiles.value = ''
                this.scroll()
            }
        },
        scroll(){
            setTimeout(()=>{
                if(this.$refs.fcontainer){
                    this.$refs.fcontainer.scrollTop = this.$refs.fcontainer.scrollHeight
                }
            },100)
        },
        f_select(item){
            item.isSelected = !item.isSelected
        },
        del(){
            this.f_index = 0
            while(this.f_index<this.file_list.length){
                if(this.file_list[this.f_index].isSelected){
                    this.file_list.splice(this.f_index,1)
                    this.f_index--
                    this.flag = false
                }
                this.f_index++
            }
            if(this.flag) this.file_list.splice(this.file_list.length-1,1);
            this.flag = true
            this.scroll()
        },
        up(){
            this.obj = new FormData()
            this.obj.append('uid',this.user.id)
            this.obj.append('title',this.title)
            this.obj.append('content',this.$refs.content.innerHTML)
            for(let f in this.file_list) this.obj.append('file',this.file_list[f].file)
            this.upload(this.obj)
        },
        edit(){
            this.obj = new FormData()
            this.obj.append('nid',this.current.id)
            this.obj.append('title',this.title)
            this.obj.append('content',this.$refs.content.innerHTML)
            for(let f in this.file_list) this.obj.append('file',this.file_list[f].file)
            for(let i in this.ilist) {
                if(this.ilist[i].isSelected) this.idel.push(this.ilist[i].id)
            }
            for(let f in this.flist) {
                if(this.flist[f].isSelected) this.fdel.push(this.flist[f].id)
            }
            if(this.idel.length) this.obj.append('idel',JSON.stringify(this.idel))
            if(this.fdel.length) this.obj.append('fdel',JSON.stringify(this.fdel))
            this.obj1 = {
                path:'index.php?c=service&a=edit',
                content:this.obj,
                config:this.config
            }
            axPost(this.obj1)
            .then((res)=>{
                if(res.data){
                    alert('保存成功')
                    this.init(1)
                }else {
                    alert('没有修改内容')
                }
            })
        },
        submit(){
            if(this.isCreate||this.isEdit){
                this.t_index = 0
                this.flag = true
                for (let i = 0; i < 2; i++) {
                    this.next(1)
                    if(!this.flag) {
                        this.flag = true
                        return
                    }                   
                }
                let cf = this.isCreate?confirm('确定要上传吗？'):confirm('确定要保存吗？')
                if(cf){
                    if(this.isCreate) this.up()
                    else this.edit()
                }
            }else {
                this.toggle()
                this.t_select(0)
            }
        },
        toggle(){
            this.isEdit = !this.isEdit
            this.btn_v = this.isEdit?'保存':'编辑'
            for(let i in this.ilist) this.ilist[i].isSelected = false
            for(let f in this.flist) this.flist[f].isSelected = false
            this.title = this.current.title
            this.$refs.content.innerHTML = this.current.content
        },
        t_select(index,flag){
            this.t_index = index
            setTimeout(()=>{
                if(index){
                    if(flag) this.tfocus()
                } 
                else this.$refs.title.focus()
            },100)
        },
        next(key){
            if(this.t_index){
                if(!this.$refs.content.innerHTML.trim()){
                    alert('内容不能为空')
                    this.t_select(1,1)
                    this.flag = false
                }else if(this.$refs.content.innerHTML.match('&nbsp')){
                    alert('内容不能包含空格')
                    this.t_select(1,1)
                    this.flag = false
                }else if(!key) this.submit()
            }else{
                if(!this.title.trim()){
                    alert('标题不能为空')
                    this.flag = false
                }
                this.t_select(this.title.trim()?1:0,1)
            }
        },
        tfocus() {
            let range = document.createRange()
            range.selectNodeContents(this.$refs.content)
            range.collapse(false)
            let sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        },
        toggle_screen(url){
            this.currentImg = url??''
        },
        f_event(item,flag){
            if(this.isEdit) this.f_select(item)
            else {
                if(flag) this.toggle_screen(item.fields.src)
            }
        }
    },
    mounted(){
        this.init(1)
        if(this.isCreate) this.t_select(0)
    }
}
</script>

<style>
    .e_wrapper {
        position:absolute;
        display:flex;
        flex-wrap:wrap;
        flex-direction:column;
        left:30%;
        top:5%;
        width:40vw;
        box-sizing: border-box;
        border:1px solid black;
        backGround-color:skyblue;
        padding:20px;
    }
    .e_wrapper .e_item {
        width:100%;
        display:flex;
        box-sizing:border-box;
        padding:10px 5px;
        border:1px solid #ccc;
        text-align:left;
        font-weight:bold;
    }
    .e_wrapper .nor {
        align-items:center;
    }
    .e_item input {
        width:25vw;
        height:15px;
    }
    .e_item .tarea {
        width:30vw;
        height:40vh;
        border:1px solid #ccc;
        backGround:#fff;
        overflow:auto;
    }
    .e_item .files {
        backGround:#fff;
        max-width: 420px;
        max-height:100px;
        box-sizing: border-box;
        overflow:auto;
    }
    .e_item .files .file {
        display:flex;
        border:1px solid black;
        width:100px;
        height:100px;
        flex-direction:column;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        float:left;
        user-select: none;
    }
    .e_item .files .file img {
        width:90px;
        height:90px;
        cursor:pointer;
        user-select: none;
    }
    .e_item .files .file .icon {
        width:50px;
        height:50px;
    }
    .e_item .files .file span {
        display:inline-block; 
        width:80px; 
        height:25px; 
        line-height: 25px;
        text-overflow: ellipsis;
        word-break: break-all; 
        white-space: nowrap; 
        overflow: hidden;
        text-align: center;
    }
    .e_item .files .selected {
        border:1px solid red;
    }
    .e_item .ef_btn {
        margin-left:10px;
        height:30px;
    }
    .cover {
        width:100vw;
        height:200vh;
        background:rgba(0,0,0,0.3);
        display:flex;
        justify-content:center;
        cursor:pointer;
    }
    .cover img {
        position:absolute;
        margin-top:100px;
        user-select:none;
    }
    .beneath {
        z-index:-1;
    }
    .del {
        opacity:0.5;
    }
    .cp {
        cursor:pointer;
    }
    .normal {
        margin-left:10px;
    }
</style>