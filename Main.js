let tasks = JSON.parse(localStorage.getItem("tasks")) || []

let deletedCount = 0
let editedCount = 0
let original=[...tasks]

const input=document.getElementById("taskInput")
const list=document.getElementById("taskList")

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks))
}

function render(){

list.innerHTML=""

tasks.forEach((task,i)=>{

const li=document.createElement("li")
li.className="task"
li.draggable=true

if(task.completed) li.classList.add("completed")

li.innerHTML=`

<input type="checkbox" class="select">

<input type="checkbox" class="complete" ${task.completed?"checked":""}>

<span>${task.text}</span>

<button class="delete">
<i class="fa fa-x"></i>
</button>

`

list.appendChild(li)

const select=li.querySelector(".select")

select.onchange=()=>{
li.classList.toggle("selected")
}

li.querySelector(".complete").onclick=()=>{
task.completed=!task.completed
render()
}

li.querySelector(".delete").onclick=()=>removeTask(i)

const span=li.querySelector("span")

span.ondblclick=()=>editTask(span,i)

dragEvents(li)

})

updateStats()
save()

}

function updateStats(){

document.getElementById("total").textContent=tasks.length

document.getElementById("completed").textContent=
tasks.filter(t=>t.completed).length

document.getElementById("deleted").textContent=deletedCount
document.getElementById("edited").textContent=editedCount

}

function addTask(){

const text=input.value.trim()

if(!text){
alert("Task cannot be empty")
return
}

if(tasks.some(t=>t.text.toLowerCase()==text.toLowerCase())){
alert("Duplicate task")
return
}

tasks.push({text,completed:false})

input.value=""

render()

}

function removeTask(i){

if(confirm(`Delete "${tasks[i].text}" ?`)){

const item=list.children[i]

item.classList.add("removing")

setTimeout(()=>{

tasks.splice(i,1)
deletedCount++

render()

},250)

}

}

function editTask(span,index){

const old=tasks[index].text

const edit=document.createElement("input")
edit.type="text"
edit.value=old

span.replaceWith(edit)

edit.focus()

function saveEdit(){

let val=edit.value.trim()

if(!val) val=old

if(tasks.some((t,i)=>t.text.toLowerCase()==val.toLowerCase() && i!==index)){
alert("Duplicate task")
edit.value=old
return
}

tasks[index].text=val

editedCount++

render()

}

edit.addEventListener("blur",saveEdit)

edit.addEventListener("keydown",e=>{
if(e.key==="Enter") saveEdit()
})

}

document.getElementById("deleteSelected").onclick=()=>{

const selected=[...document.querySelectorAll(".select:checked")]

if(selected.length===0){
alert("No tasks selected")
return
}

if(confirm(`Delete ${selected.length} selected tasks?`)){

selected.forEach(box=>{
box.parentElement.classList.add("removing")
})

setTimeout(()=>{

selected.forEach(box=>{

const text=box.parentElement.querySelector("span").textContent
const index=tasks.findIndex(t=>t.text===text)

if(index!==-1){
tasks.splice(index,1)
deletedCount++
}

})

render()

},250)

}

}

function dragEvents(li){

li.addEventListener("dragstart",()=>{
li.classList.add("dragging")
})

li.addEventListener("dragend",()=>{
li.classList.remove("dragging")
})

list.addEventListener("dragover",e=>{

e.preventDefault()

const dragging=document.querySelector(".dragging")

const after=getAfter(e.clientY)

if(after==null) list.appendChild(dragging)
else list.insertBefore(dragging,after)

})

}

function getAfter(y){

const els=[...list.querySelectorAll(".task:not(.dragging)")]

return els.reduce((closest,child)=>{

const box=child.getBoundingClientRect()

const offset=y-box.top-box.height/2

if(offset<0 && offset>closest.offset){
return {offset,element:child}
}else{
return closest
}

},{offset:Number.NEGATIVE_INFINITY}).element

}

document.getElementById("addBtn").onclick=addTask

input.addEventListener("keypress",e=>{
if(e.key==="Enter") addTask()
})

document.getElementById("themeBtn").onclick=()=>{
document.body.classList.toggle("dark")
}

document.getElementById("sortAsc").onclick=()=>{
tasks.sort((a,b)=>a.text.localeCompare(b.text))
render()
}

document.getElementById("sortDesc").onclick=()=>{
tasks.sort((a,b)=>b.text.localeCompare(a.text))
render()
}

document.getElementById("resetSort").onclick=()=>{
tasks=[...original]
render()
}

render()