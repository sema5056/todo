let history=[];
let tasks= [];
function saveToStorage(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadFromStorage(){
    const savedTasks=localStorage.getItem("tasks");
    if(savedTasks){
        tasks=JSON.parse(savedTasks);
    }
}
function saveToHistory(){
    history.push(JSON.stringify(tasks));
    if(history.length>5){
        history.shift();
    }
    console.log("history:", history);
}
function undo(){
    if(history.length===0){
        return;
    }
    tasks=JSON.parse(history.pop());
    saveToStorage();
    document.getElementById("taskList").innerHTML="";
    loadTasks();
}
function renderTask(task){
    const li=document.createElement("li");
    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    checkbox.checked=task.completed;
    const span =document.createElement("span");
    span.textContent=task.text;
    const DeleteBtn=document.createElement("button");
    DeleteBtn.textContent="❌";
    if(task.completed){
        span.style.textDecoration="line-through";
        li.classList.add("done");}
    span.addEventListener("dblclick",()=>{
        const editInput=document.createElement("input");
        editInput.type="text";
        editInput.value=span.textContent;
        li.replaceChild(editInput,span);
        editInput.focus();
        saveToHistory();
        const save=()=>{
            task.text=editInput.value;
            span.textContent=editInput.value;
            li.replaceChild(span, editInput);
            saveToStorage();
        };
        editInput.addEventListener("keydown",(e)=>{
            if(e.key==="Enter"){
                save()
            }
        });
        editInput.addEventListener("blur",save);
    });
    DeleteBtn.onclick=function(){
        saveToHistory();
        tasks=tasks.filter(function(item){
            return item.id!==task.id;
        });
        saveToStorage();
        li.remove();
        updateCounter();
    };
    checkbox.onchange=function(){
        saveToHistory();
        if(checkbox.checked){
            span.style.textDecoration="line-through";
            li.classList.add("done");
            task.completed=true;
        }else{
            span.style.textDecoration="none";
            li.classList.remove("done");
            task.completed=false;
        }
        saveToStorage();
        updateCounter();
    };
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(DeleteBtn);
    document.getElementById("taskList").appendChild(li);
}
function loadTasks(){
    tasks.forEach(function(task){
        renderTask(task);
    });
    updateCounter();
}
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value;
    if (text === "") return;
    const task={
        id:Date.now(),
        text:text,
        completed:false
    };
    saveToHistory();
    tasks.push(task);
    saveToStorage();
    renderTask(task);
    input.value="";
    updateCounter();}
const input=document.getElementById("taskInput");
input.addEventListener("keydown",function(event){
    if (event.key==="Enter"){
        event.preventDefault();
        addTask();
    }
});
function filterTasks(type){
    const tasks=document.querySelectorAll("#taskList li");
    tasks.forEach(function(li){
        const isDone=li.classList.contains("done");
        if(type==="all"){
            li.style.display="flex";
        }else if(type==="done"){
            li.style.display=isDone? "flex":"none";
        }else if(type==="active"){
            li.style.display=isDone?"none":"flex";
        }
    });
}
function updateCounter(){
    const tasks=document.querySelectorAll("#taskList li");
    let activeCount=0;
    tasks.forEach(function(li){
        const isDone=li.classList.contains("done");
        if(!isDone){
            activeCount++;
        }
    });
    document.getElementById("counter").textContent=
        "Active Tasks:"+activeCount;
}
function clearDone(){
    saveToHistory();
    tasks=tasks.filter(function(task){
        return !task.completed;
    });
    saveToStorage();
    const tasksElements=document.querySelectorAll("#taskList li");
    tasksElements.forEach(function(li){
        if(li.classList.contains("done")){
            li.remove();
        }
    });
    updateCounter();
}
function clearAll(){
    saveToHistory();
    tasks=[];
    saveToStorage();
    document.getElementById("taskList").innerHTML="";
    updateCounter();
}
document.addEventListener("keydown", function(event){
    if(event.ctrlKey&& event.code==="KeyZ"){
        event.preventDefault();
        event.stopPropagation();
        undo();
    }
});
loadFromStorage();
loadTasks();
