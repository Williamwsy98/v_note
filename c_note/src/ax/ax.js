import axios from 'axios'
// const url = process.env.NODE_ENV==='production'?'http://192.168.1.96:8000/':''
function axGet(obj) {
    let query = ''
    if(obj.content){
        for(let item in obj.content){
            query += `${item}=${obj.content[item]}&`
        }
        query = query.slice(0,query.length-1)
    }
    obj.path = `${obj.path}?${query}`
    return new Promise((rsv)=>{
        axios.get(obj.path).then((res)=> {
            rsv(res)
        })
    })
}
function axPost(obj) {
    return new Promise((rsv)=>{
        obj.path = `${obj.path}`
        axios.post(obj.path,obj.content,obj.config).then((res)=>{
            rsv(res)
        })
    })
}
export {
    axGet,
    axPost
}