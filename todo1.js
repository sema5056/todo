function addTask() {
    console.log("работает!");
    const input = document.getElementById("taskInput");
    const text = input.value;
    if (text === "") return;
    const li = document.createElement("li");
    const checkbox=document.createElement("input");
    checkbox.type="checkbox";
    const span = document.createElement("span");
    span.addEventListener('dblclick',()=>{
        const input=document.createElement('input');
        input.type='text';
        input.value=span.textContent;
        li.replaceChild(input,span);
        input.focus();
        const save=()=>{
            span.textContent = input.value;
            li.replaceChild(span,input);
        };
        input.addEventListener('keydown',(e)=>{
            if(e.key==='Enter'){
                save();
            }
        });
        input.addEventListener('blur,save');
    })
    span.textContent=text;
    const DeleteBtn=document.createElement("button");
    DeleteBtn.textContent="❌";
    DeleteBtn.onclick=function(){
        li.remove();
        updateCounter();
    };
    checkbox.onchange=function(){
        if(checkbox.checked){
            span.style.textDecoration="line-through";
            li.classList.add("done");
        }else{
            span.style.textDecoration="none";
            li.classList.remove("done");
        }
        updateCounter();
    };
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(DeleteBtn);
    document.getElementById("taskList").appendChild(li);
    input.value = "";
    updateCounter();
}
const input=document.getElementById("taskInput");
input.addEventListener("keydown",function(event){
    if(event.key==="Enter"){
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
    const tasks=document.querySelectorAll("#taskList li");
    tasks.forEach(function(li){
        if(li.classList.contains("done")){
            li.remove();
        }
    });
    updateCounter();
}