/* element, Widgets and Data, initialization*/
const main = document.getElementById("main");
const session = JSON.parse(localStorage.getItem("session")) || [];
let database = JSON.parse(localStorage.getItem("database")) || [];
let users = JSON.parse(localStorage.getItem("identity")) || [];
let searchList = [];
const logoutBtn = document.querySelector("#header button");
const addBtn = document.querySelectorAll("#header a")[0];
const listBtn = document.querySelectorAll("#header a")[1];
const formFields = document.querySelectorAll("#header input");
const searchBtn = formFields[1];
const searchTextField = formFields[0];
const asideBtn = document.querySelectorAll("#aside button");
const deleteAllBtn = asideBtn[0];
const deleteAccountBtn = asideBtn[1];
const changePasswordBtn = asideBtn[2];
const exportBtn = asideBtn[3];
const importBtn = asideBtn[4];
let cursor = 0; // fetch starting point
let limit = 3; // fetch only 3 items
let searchTerm = "";
dashboardView();

/*user interface views */
function dashboardView(){
    const title = document.getElementsByTagName("title")[0];
    title.innerText = "Welcome "+session[0].id;
    notLoggedIn();
    logoutBtn.addEventListener("click", logout);
    addBtn.addEventListener("click", (e)=>{e.preventDefault();addView();});
    listBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        cursor = 0; 
        searchTerm = "";
        ListView();
    });
    deleteAllBtn.addEventListener("click", ()=>{
        showDialogBox("Are you sure?. this operation will delete all your saved password", deleteAll);
    });
    deleteAccountBtn.addEventListener("click", ()=>{
        showDialogBox("Are you sure?. this operation will delete all your account details", deleteAccount); 
    });
    changePasswordBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        accountView();
   });
    
    searchTextField.addEventListener("keydown", (e)=>{
        if(e.key === "Enter"){
            if(searchTextField.value !== ""){
                cursor = 0; 
                searchTerm = searchTextField.value;
                searchBtn.disabled = true;
                searchTextField.disabled = true;
                search();
                lists();

            }else{
                showMessageBox("please your search term must not be empty");
            }
           
        }
    });
    searchBtn.addEventListener("click", ()=>{
        if(searchTextField.value !== ""){
            cursor = 0; 
            searchTerm = searchTextField.value;
            searchBtn.disabled = true;
            searchTextField.disabled = true;
            search();
            lists();

        }else{
            showMessageBox("please your search term must not be empty");
        }
    }) ;
    ListView();
     
}
function accountView(){
    main.innerHTML = `
    <h1> CHANGE YOUR PASSWORD<h1>
     <form id="change">
        <label>OLD PASSWORD
            <input type="password" id="former" required/>
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
            <input type="submit" value="CHANGE">
        </label>
    </form>`;
    change = document.getElementById("change");
    change.addEventListener("submit", (e)=>{
        e.preventDefault();
        const former = document.getElementById("former").value;
        const passwordInput = document.getElementById("password");
        const revealInput = document.getElementById("reveal");
        let password = "";
        if(passwordInput){
            password = passwordInput.value;
        }else if(revealInput){
            password = revealInput.value;
        }
        const confirm = document.getElementById("confirm").value;
        changePassword(former, password, reveal, confirm);
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
function ListView(){
    database = JSON.parse(localStorage.getItem("database")) || [];
    searchList = [];
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
function changePassword(former, password, reveal, confirm){
    let isUser = false;
    for(const user of users ){
        if(user.password === former && user.id === session[0].id){
            isUser = true;
            if(password === confirm){
                user.password = password;
                localStorage.setItem("identity", JSON.stringify(users));
                showMessageBox("password Change successfully");
                
            }else{
                showMessageBox("comfirm password");
            }
            break;
        }
    }
    if(!isUser){
        showMessageBox("you don't have access to this account");
        logout();
    }
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
function search(){
    for(const data of database){
        if(data.owner === session[0].id && data.username.toLowerCase().includes(searchTerm.toLowerCase())
            || data.owner === session[0].id && data.domain.toLowerCase().includes(searchTerm.toLowerCase())
            || data.owner === session[0].id && data.description.toLowerCase().includes(searchTerm.toLowerCase())
        ){
            searchList.push(data);
        }
    }
    if(searchList.length !== 0){
         database = searchList;
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
                       <span>USERNAME: ${dataObj["username"]}</span>
                   </div>
                   <div class="col-2">
                       <label>PASSWORD: <input type="password" value="${dataObj['password']}" disabled/></label>
                       <strong>DOMAIN: ${dataObj["domain"]}</strong>
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
    searchBtn.disabled = false;
    searchTextField.disabled = false;
    if(list.innerHTML === ""){
        showMessageBox("No results found");
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
        }else{
            count += 1; //count how many database entry record in this account
        }
    }
    if(count === 0){ // no record tied to this account in the database
        showMessageBox("You don't have any data record to  delete!!!");
        return;
    }else{
        database = [];
        database = arr;
        localStorage.setItem("database",JSON.stringify(database));
        ListView();
    }
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