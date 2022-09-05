<template>
  <div id="app">
    <div class="wrapper">
      <router-view/>
    </div>
  </div>
</template>

<style>
* {
  padding:0%;
  margin:0%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.wrapper {
  width:100vw;
  height:100vh;
  position:relative;
  overflow:hidden;
}
.menu {
  position:absolute;
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
  left:35%;
  top:10%;
  /* width:30vw; */
  box-sizing: border-box;
  border:1px solid black;
  backGround-color:skyblue;
  padding:20px;
}
.menu .head{
  font-size:30px;
  font-weight:bold;
  text-align:left;
}
.menu .m_btn {
  width:30vw;
  height:40px;
  margin-top:20px;
}
.menu .nf_btns .nf_btn,.e_item .e_btn {
  padding:5px;
  /* float:right; */
  box-sizing:border-box;
}
.menu .m_btn, .menu .nf_btns .nf_btn, .e_item .e_btn {
  border:1px solid #fff;
  backGround:#4e6ef2;
  color:#fff;
  border-radius:5px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
}
.menu .m_btn:hover,.menu .nf_btns .nf_btn:hover,.e_item .e_btn:hover {
  opacity:0.5;
}
.menu .nf {
  backGround:#fff;
  padding:5px;
}
.menu .nf,.menu .nf_btns {
  margin-top:10px;
  box-sizing: border-box;
}
.menu .nf table {
  width:100%;
}
.menu .nf table td {
  overflow:hidden;
  text-overflow:ellipsis;
  /* max-width:100px; */
}
.menu .nf table td span{
  color:blue;
  text-decoration:underline;
  cursor:pointer;
}
.nf_btn:last-child {
  margin-right:10px;
}
form {
  width: 600px;
  position:absolute;
  left:35%;
  top:60px;
}
form > fieldset {
  padding: 10px;
}
form > fieldset > label {
  float:left;
}
form > fieldset > .inp {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin: 10px 0;
  border:none;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  padding-left: 5px;
  box-sizing: border-box;       
}
form > fieldset > .btn {
  cursor:pointer;
}
form > fieldset > .check_container {
  float:left;
}
form > fieldset > .check_container span {
  margin-left:5px;
}
</style>

<script>
  import {mapMutations} from 'vuex'
  export default {
    name:'App',
    methods:{
      ...mapMutations(['init'])
    },
    mounted(){
      this.init()
    }
  }
</script>
