/* element, Widgets and Data, initialization*/
const main = document.getElementById("main");
const header = document.getElementById("header");
const ids = JSON.parse(localStorage.getItem("identity")) || [];
const session = JSON.parse(localStorage.getItem("session")) || [];
loginView();

/*user interface views */
 function loginView(){
    header.innerHTML = `<h1>LOGIN</h1>
            <p>Welcome back. Please Login to manage your passwords.</p> `;
     main.innerHTML =`
     <form id="login">
        <label>USERNAME
            <input type="text" id="username" required/>
        </label>
        <label>PASSWORD
            <input type="password" id="password" required/>
        </label>
        <label>
            <input type="submit" value="Submit">
        </label>
        <label>
          <a href="Javascript:signupView()">Create Account</a>
        </label>
    </form>`;
    login();
}
function signupView(){
    header.innerHTML = `<h1>NEW ACCOUNT</h1>
    <p>Please enter your credentials to create new account.</p> `;
    main.innerHTML =`
     <form id="signup">
        <label>USERNAME
            <input type="text" id="username" required/>
        </label>
        <label>PASSWORD
            <input type="password" id="password" required/>
        </label>
        <label>CONFIRM PASSWORD
            <input type="password" id="confirm" required/>
        </label>
        <label>
            <input type="submit" value="Submit">
        </label>
    </form>`;
    signup();
}



/* app logic and functions */
function showMessageBox(message){
    document.getElementById("box").classList.toggle("hidden");
    document.getElementById("message").innerText = message;
    document.querySelector("#messageBox #buttons #close").onclick = function(){
             document.getElementById("box").classList.toggle("hidden");
    };
}
function sessions(id){
    session.push({"id":id});
    localStorage.setItem("session",JSON.stringify(session));
}
function loggedIn(){
    if(session.length !== 0){
        window.location.href = "dashboard.html";
    }
}
function login(){
    loggedIn();//check whether user is already logged in
    const loginForm = document.getElementById("login");
    const password = document.getElementById("password");
    const username = document.getElementById("username");
    let   userId ="";
    let logon = false;
    loginForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        for(const id of ids){
            if(id["password"] === password.value && id["username"] === username.value){
                logon = true;
                userId = id["id"];
            }
        }
        if(logon){
            sessions(userId);
            window.location.href = "dashboard.html";
        }else{
            showMessageBox("please enter your correct credentials");
        }
    });
}
function randomNumbers(){
    //return random three digit number (0-9) each
    return (Math.floor(Math.random() * 10)+""+Math.floor(Math.random() * 10)
    +""+Math.floor(Math.random() * 10));
}
function signup(){
    loggedIn();//check whether is already logged in
     //allow user to create new id
     const signupForm = document.getElementById("signup");
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const username = document.getElementById("username");
     signupForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        if(username.value){
            if(password.value){
                if(confirm.value === password.value){
                    ids.push({"username":username.value, "password":password.value, "id":(username.value+"-MD"+randomNumbers())});
                    localStorage.setItem("identity",JSON.stringify(ids))
                    loginView();
                }else{
                    showMessageBox("confirm password");
                }
            }else{
                showMessageBox("enter password");
            }
        }else{
            showMessageBox("enter username");
        }
        
        
    });
    
}
function destroy_storage(key){
    localStorage.removeItem(key);
}
function destroy_all_storage(){
localStorage.clear();
}

