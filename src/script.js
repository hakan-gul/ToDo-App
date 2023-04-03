    "use strict";
    
    let gorevListesi= [];

    if(localStorage.getItem("gorevListesi") != null){
        gorevListesi = JSON.parse(localStorage.getItem("gorevListesi"));
    }

    let editId;
    let isEditTask = false;

    const taskInput = document.querySelector("#txtTaskName");
    const btnClear = document.querySelector("#btnClear");
    const filters = document.querySelectorAll(".filters span");

    displayTasks("all");


    function displayTasks(filter){
        let ul = document.getElementById("task-list");
        ul.innerHTML = "";

        if(gorevListesi.length == 0){
            ul.innerHTML = `<li class="list-group-item">Görev bulunamadı.</li>`;
        }else{


    for(let gorev of gorevListesi){

        let completed = gorev.durum == "completed" ? "checked" : "";

        if(filter == gorev.durum || filter == "all"){
            
        let li = `
        <li class="task list-group-item">
            <div class="form-check">
                <input onclick="updateStatus(this)" type="checkbox" id="${gorev.id}" class="form-check-input"${completed}>
                <label for="${gorev.id}" class="form-check-label ${completed}">${gorev.gorevAdi}</label>
            </div>
            <div class="dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fa-solid fa-ellipsis"></i>
            </button>
            <ul class="dropdown-menu">
                <li><a onclick="deleteTask(${gorev.id})" class="dropdown-item" href="#"><i class="fa-solid fa-trash-can"></i> Sil</a></li>
                <li><a onclick='editTask(${gorev.id}, "${gorev.gorevAdi}")' class="dropdown-item" href="#"><i class="fa-solid fa-pen"></i> Düzenle</a></li>
            </ul>
            </div>
        </li>
    `;
    ul.insertAdjacentHTML("beforeend", li);
        
    }


    }
    }
    }

    document.querySelector("#btnAddNewTask").addEventListener("click", newTask);
    document.querySelector("#btnAddNewTask").addEventListener("keyypress", function(){
        if(event.key == "Enter"){
            document.getElementById("btnAddNewTask").click();
        }
    });

    for(let span of filters) {
        span.addEventListener("click", function(){
            document.querySelector("span.active").classList.remove("active");
            span.classList.add("active");
            displayTasks(span.id);
        })
    }

    

    function newTask(event){

        if(taskInput.value == ""){
            alert("Lütfen bir görev giriniz.");
        }else{
            if(!isEditTask){
                //ekleme
                gorevListesi.push({"id":gorevListesi.length+1, "gorevAdi": taskInput.value, "durum":"pending"});
            }else{
                //güncelleme
                for(let gorev of gorevListesi){
                    if(gorev.id == editId){
                        gorev.gorevAdi = taskInput.value;
                    }
                    isEditTask = false;
                    document.getElementById("btnAddNewTask").innerHTML = "Ekle";
                }

            }
            taskInput.value = "";
            displayTasks(document.querySelector("span.active").id);
            localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        }
       
        event.preventDefault();

    }

    function deleteTask(id){

        let deleteId;
        deleteId = gorevListesi.findIndex(gorev => gorev.id == id);
        
        gorevListesi.splice(deleteId, 1);
        displayTasks(document.querySelector("span.active").id);
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
    }

    function editTask(taskID, taskName){
        editId = taskID;
        isEditTask = true;
        taskInput.value = taskName;
        taskInput.focus();
        taskInput.classList.add("active");
        document.getElementById("btnAddNewTask").innerHTML = "Güncelle";
        
        console.log("edit id: " , editId);
        console.log("edit mode: " , isEditTask);
    }


    document.getElementById("btnClear").addEventListener("click", function(){
        gorevListesi = [];
        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));
        displayTasks();

    });

    function updateStatus(selectedTask){

        let label = selectedTask.nextElementSibling;
        let durum;
        if(selectedTask.checked){
            label.classList.add("checked");
            durum ="completed"
        }else {
            label.classList.remove("checked");
            durum = "pending";
        }
        for (let gorev of gorevListesi){
            if(gorev.id == selectedTask.id){
                gorev.durum = durum;
            }
        }

        displayTasks(document.querySelector("span.active").id);

        localStorage.setItem("gorevListesi", JSON.stringify(gorevListesi));

    }
