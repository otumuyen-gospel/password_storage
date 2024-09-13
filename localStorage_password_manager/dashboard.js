/* element, Widgets and Data, initialization*/
const main = document.getElementById("main");
const session = JSON.parse(localStorage.getItem("session")) || [];
let database = JSON.parse(localStorage.getItem("database")) || [];
let users = JSON.parse(localStorage.getItem("identity")) || [];
const logoutBtn = document.querySelector("#header button");
const addBtn = document.querySelectorAll("#header a")[0];
const listBtn = document.querySelectorAll("#header a")[1];
const formFields = document.querySelectorAll("#header input");
const searchBtn = formFields[1];
const searchTextField = formFields[0];
const asideBtn = document.querySelectorAll("#aside button");
const deleteAllBtn = asideBtn[0];
const deleteAccountBtn = asideBtn[1];
const exportBtn = asideBtn[2];
const importBtn = asideBtn[3];
let cursor = 0; // fetch starting point
let limit = 3; // fetch only 3 items
dashboardView();

/*user interface views */
function dashboardView(){
    const title = document.getElementsByTagName("title")[0];
    title.innerText = "Welcome "+session[0].id;
    notLoggedIn();
    logoutBtn.addEventListener("click", logout);
    addBtn.addEventListener("click", (e)=>{e.preventDefault();addView();});
    listBtn.addEventListener("click", (e)=>{e.preventDefault();ListView();});
    deleteAllBtn.addEventListener("click", ()=>{
        showDialogBox("Are you sure?. this operation will delete all your saved password", deleteAll);
    });
    deleteAccountBtn.addEventListener("click", ()=>{
        showDialogBox("Are you sure?. this operation will delete all your account details", deleteAccount); 
    });
    
    /*
    formFields.addEventListener("keydown", (e)=>{
        if(e.key === "Enter"){
            search(formFields.value);
            searchBtn.disabled = true;
        }
    });
    searchBtn.addEventListener("click", ()=>{
        search(formFields.value);
        searchBtn.disabled = true;
    }) */
    ListView();
     
}
function ListView(){
    const list = `<ul id="list"></ul> 
    <div id="paginator">
     <a href="Javascript:prev()">Prev</a>
     <a href="Javascript:next()">Next</a>
    </div>
    `;
    main.innerHTML = list;
    cursor = 0;
    lists();
}
function generatePassword(){
    //return random three digit number (0-9) each
    const data = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+"!@#$%^&*()_+{}:<>?,.;"+
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase();
    let password = "";
    for(let count = 1; count <= 15; count++){
        password += data.charAt(Math.floor(Math.random() * data.length));
    }
    return password;
}
function addView(){
    let user_id = database.length > 0 ? parseInt(database[database.length - 1].id) : 0;
    user_id++;
    main.innerHTML = `
    <h1> ADD NEW ENTRIES<h1>
     <form id="addForm">
        <label>ID
            <input type="text" id="id" value="${user_id}" disabled/>
        </label>
        <label>OWNER
            <input type="text" id="owner" value="${session[0].id}" disabled/>
        </label>
        <label>DOMAIN(App or website url)
            <input type="text" id="domain" required/>
        </label>
        <label>USERNAME
            <input type="text" id="username" required/>
        </label>
        <label>DESCRIPTION
            <input type="text" id="description" required/>
        </label>
        <label>PASSWORD
            <input type="password" id="password" required/>
             <input type="text" id="revealed" class="hidden"/>
        </label>
        <label>CONFIRM
            <input type="password" id="confirm" required/>
        </label>
        <label>GENERATE PASSWORD | REVEAL PASSWORD
            <input type="button" id="generate" value="GENERATE"/>
            <input type="button" id="reveal" value="REVEAL"/>
        </label>
        <label>
            <input type="submit" value="ADD">
            <input type="reset" value="CLEAR" id="reset">
        </label>
    </form>`;
    addForm = document.getElementById("addForm");
    addForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const id = document.getElementById("id").value;
        const owner = document.getElementById("owner").value;
        const domain = document.getElementById("domain").value;
        const username = document.getElementById("username").value;
        const passwordInput = document.getElementById("password");
        const revealInput = document.getElementById("reveal");
        let password = "";
        if(passwordInput){
            password = passwordInput.value;
        }else if(revealInput){
            password = revealInput.value;
        }
        const confirm = document.getElementById("confirm").value;
        const description = document.getElementById("description").value;
        add(id, owner, domain, username, password, confirm, description);
    });
    addForm.addEventListener("reset", (e)=>{
        e.preventDefault();
        addView();
    });
    const generate = document.getElementById("generate");
    generate.addEventListener("click", (e)=>{
        e.preventDefault();
        let password = generatePassword();
        const passwordInput = document.getElementById("password");
        if(passwordInput){
            passwordInput.value= password;
        }
        document.getElementById("confirm").value = password;
        const revealInput = document.getElementById("revealed");
        if(revealInput){
            revealInput.value = password;
        }
    });
    const reveal = document.getElementById("reveal");
    reveal.addEventListener("click", (e)=>{
        e.preventDefault();
        const revealed = document.getElementById("revealed");
       const password =  document.getElementById("password");
       if(reveal.value !== "HIDE"){
         if(password.value !== "" && password){
            revealed.classList.toggle("hidden");
            revealed.value = password.value;
            password.classList.toggle("hidden");
            reveal.value = "HIDE";
          }
       }else{
        revealed.classList.toggle("hidden");
        password.classList.toggle("hidden");
       }
    });
}
function editView(index){
    let data = database[index];
    main.innerHTML = `
    <h1>UPDATE ENTRY ID[${data['id']}]<h1>
     <form id="editForm">
        <label>ID
            <input type="text" id="id" value="${data['id']}" disabled/>
        </label>
        <label>OWNER
            <input type="text" id="owner" value="${data['owner']}" disabled/>
        </label>
        <label>DOMAIN(App or website url)
            <input type="text" id="domain" value="${data['domain']}" required/>
        </label>
        <label>USERNAME
            <input type="text" id="username" value="${data['username']}" required/>
        </label>
        <label>DESCRIPTION
            <input type="text" id="description" value="${data['description']}" required/>
        </label>
        <label>PASSWORD
            <input type="password" id="password" value="${data['password']}" required/>
            <input type="text" id="revealed" class="hidden"/>
        </label>
        <label>CONFIRM
            <input type="password" id="confirm" value="${data['password']}" required/>
        </label>
        <label>GENERATE PASSWORD | REVEAL PASSWORD
            <input type="button" id="generate" value="GENERATE"/>
            <input type="button" id="reveal" value="REVEAL"/>
        </label>
        <label>
            <input type="submit" value="Update Password">
        </label>
    </form>`;
    editForm = document.getElementById("editForm");
    editForm.addEventListener("submit", (e)=>{
        e.preventDefault();
        const id = document.getElementById("id").value;
        const owner = document.getElementById("owner").value;
        const domain = document.getElementById("domain").value;
        const username = document.getElementById("username").value;
        const passwordInput = document.getElementById("password");
        const revealInput = document.getElementById("reveal");
        let password = "";
        if(passwordInput){
            password = passwordInput.value;
        }else if(revealInput){
            password = revealInput.value;
        }
        const confirm = document.getElementById("confirm").value;
        const description = document.getElementById("description").value;
        edit(index, id, owner, domain, username, password, confirm, description);
    });
    const generate = document.getElementById("generate");
    generate.addEventListener("click", (e)=>{
        e.preventDefault();
        let password = generatePassword();
        const passwordInput = document.getElementById("password");
        if(passwordInput){
            passwordInput.value= password;
        }
        document.getElementById("confirm").value = password;
        const revealInput = document.getElementById("revealed");
        if(revealInput){
            revealInput.value = password;
        }
    });
    const reveal = document.getElementById("reveal");
    reveal.addEventListener("click", (e)=>{
        e.preventDefault();
        const revealed = document.getElementById("revealed");
       const password =  document.getElementById("password");
       if(reveal.value !== "HIDE"){
         if(password.value !== "" && password){
            revealed.classList.toggle("hidden");
            revealed.value = password.value;
            password.classList.toggle("hidden");
            reveal.value = "HIDE";
          }
       }else{
        revealed.classList.toggle("hidden");
        password.classList.toggle("hidden");
       }
    });
    
}




/* app logic and functions */
function showMessageBox(message){
    document.getElementById("box").classList.toggle("hidden");
    document.getElementById("message").innerText = message;
    document.querySelector("#messageBox #buttons #close").onclick = function(){
             document.getElementById("box").classList.toggle("hidden");
    };
}
function showDialogBox(question, action, data){
    document.getElementById("dialog").classList.toggle("hidden");
    document.getElementById("question").innerText = question;
    document.querySelector("#dialogBox #buttons #close").onclick = function(){
        document.getElementById("dialog").classList.toggle("hidden");
        confirmation = false;
    };
    document.querySelector("#dialogBox #buttons #ok").onclick = function(){
        document.getElementById("dialog").classList.toggle("hidden");
        action(data);
    };
}

function add(id, owner, domain, username, password, confirm, description){
    if(confirm === password){
        if(!isDuplicateKeys(id)){
            const entry = {"id":id, "owner":owner, "domain":domain, "username":username,
                "password":password, "description":description};
            database.push(entry);
            localStorage.setItem("database", JSON.stringify(database));
            showMessageBox("data insertion succeeded!!!");
        }else{
            showMessageBox("this data already exist please refresh(clear) inputs");
        }
        
    }else{
        showMessageBox("confirm your password");
    }
    
    
}
function isDuplicateKeys(id){
    let isDuplicate = false;
    for(const data of database){
        if(parseInt(data["id"]) === parseInt(id)){
            isDuplicate = true;
            break;
        }
    }
    return isDuplicate;
}
function next(){
    cursor += limit;
  if(cursor < database.length){
    lists();
  }else{
    cursor -= limit;
  }
  
}
function prev(){
    cursor -= limit;
    if(cursor > -1){
        lists();
    }else{
        cursor += limit;
    }
}

function lists(){
    const list = document.getElementById("list");
    list.innerHTML = "";
    let count = 0;
    for(let data = cursor; data < database.length ; data++){
        const dataObj = database[data];
        if(dataObj["owner"] === session[0].id){
                count += 1; //found an item
                const listItem = `<li>
                    <div class="col-1">
                       <strong>ID: ${dataObj["id"]}</strong>
                       <span>OWNER: ${dataObj["owner"]}</span>
                   </div>
                   <div class="col-2">
                       <strong>DOMAIN: ${dataObj["domain"]}</strong>
                       <span>USERNAME: ${dataObj["username"]}</span>
                       <label>PASSWORD: <input type="password" value="${dataObj['password']}" disabled/></label>
                       <p>${dataObj["description"]}</p>
                    </div>
                    <div class="col-3">
                       <a href="Javascript:editView(${data})">Edit</a>
                       <a href='Javascript:showDialogBox(question="are you sure you want to delete this data? .ID[${dataObj["id"]}]", 
                       action=deletes, data=${data})'>Delete</a>
                    </div>
                </li>`;
                list.innerHTML += listItem;
                if(count === limit){
                    break; // enough for one view
                }

        }
        
    }
    if(count === 0){ //meaning no data was fetched show end label or banner
        showMessageBox("THE END");
    }

}

function edit(index, id, owner, domain, username, password, confirm, description){
    if(confirm === password){
        const entry = {"id":id, "owner":owner, "domain":domain, "username":username,
            "password":password, "description":description};
        database[index]= entry;
        localStorage.setItem("database", JSON.stringify(database));
        showMessageBox("data edition succeeded!!!");
        ListView();
    }else{
        showMessageBox("confirm your password");
    }
}
function deletes(index){
        if(database.splice(index, 1).length){
            showMessageBox("data deletion succeeded!!!");
            localStorage.setItem("database",JSON.stringify(database));
            ListView();
        }else{
            showMessageBox("data deletion failed!!!");
        }
    
}
function deleteAll(){
    let count = 0;
    let arr = []; //array of data to preserve
    for(let data = 0; data < database.length; data++){
        dataObj = database[data];
        if(dataObj["owner"] !== session[0].id){
            arr.push(dataObj);       
        }
    }
    database = [];
    database = arr;
    showMessageBox("Data Deletion succeeded!!!");
    localStorage.setItem("database",JSON.stringify(database));
    ListView();
}
function search(terms){

}
function deleteAccount(){
     //delete data
     deleteAll();

     //delete user account
     for(let data = 0; data < users.length; data++){
        dataObj = users[data];
        if(dataObj["id"] === session[0].id){
            users.splice(data, 1);
            localStorage.setItem("identity",JSON.stringify(users));
            break;
        }
    }
    
    //destroy login session
    logout();

}
function exportData(){

}
function importData(){

}
function notLoggedIn(){
    if(session.length === 0){
        window.location.href = "index.html";
    }
}
function logout(){
    destroy_storage("session");
    window.location.href = "index.html";
}
function destroy_storage(key){
    localStorage.removeItem(key);
}
function destroy_all_storage(){
localStorage.clear();
}