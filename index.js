var users = [
    {ID: 1, "Full Name" : "Admir Alicic", Username: "admiralicic", "E-mail": "admir.alicic@gmail.com", Password: "test"},
    {ID: 2, "Full Name" : "Emir Alicic", Username: "emiralicic", "E-mail": "emir.alicic@gmail.com", Password: "test"},
    {ID: 3, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 4, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 5, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 6, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 7, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 8, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 9, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 10, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 11, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 12, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
    {ID: 13, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
];

function navigate(state){
    hideError();
    var pages = document.getElementsByClassName("page");
    for(var i = 0; i < pages.length; i++){
        pages[i].id === state ? pages[i].className = "page container" : pages[i].className = " page container hiddenPage";
    }
   
}

function search(event){
    if(event.keyCode === 13){
        var criteria = event.target.value;
        var filteredUsers = users.filter(function(user){
            if(user["Full Name"].indexOf(criteria) > -1 || user.Username.indexOf(criteria) > -1){
                return user;
            }
        });

        rebuildTable(filteredUsers);
    }
}

function editUser(event){
    var btn = event.target;
    var row = btn.parentElement.parentElement.parentElement;
    var user = rowData(row);

    navigate('edit');

    var fullNameField = document.getElementById("editFullName");
    var usernameField = document.getElementById("editUsername");
    var emailField = document.getElementById("editEmail");
    var passwordField = document.getElementById("editPassword");
    var idField = document.getElementById("userId");

    fullNameField.value = user.fullName;
    usernameField.value = user.username;
    emailField.value = user.email;
    passwordField.value = user.password;
    idField.value = user.id;
}

function updateUser(){
    for(var i = 0; i < users.length; i++){
       if(users[i].ID === parseInt(document.getElementById("userId").value)){
           users[i]["Full Name"] = document.getElementById("editFullName").value;
           users[i]["Username"] = document.getElementById("editUsername").value;
           users[i]["E-mail"] = document.getElementById("editEmail").value;
           users[i]["Password"] = document.getElementById("editPassword").value;

           if(!validUser(users[i])){
               displayError("All fields are required!");
               return;
           }

           if(userExists(users[i])){
               displayError("Username or E-mail already taken!");
               return;
           }

           rebuildTable(users);
           break;
       }
    }

    navigate("list");
}

function deleteUser(event){
    if(confirm("Are you sure you want to delete a user")){
        var btn = event.target;
        var row = btn.parentElement.parentElement.parentElement;
        
        for(var i = 0; i < users.length; i++){
            if(users[i]["E-mail"] === rowData(row).email){
                users.splice(i,1);

                var tbody = document.getElementsByTagName("tbody")[0];
                tbody.removeChild(row);

                break;
            }
        }

    }
}

function rowData(row){
    return {
        id:         row.childNodes[0].textContent,
        fullName:   row.childNodes[1].textContent,
        username:   row.childNodes[2].textContent,
        email:      row.childNodes[3].textContent,
        password:   row.childNodes[4].textContent,
    }
}

function userExists(user){
    for(var i = 0; i < users.length; i++){
        if(users[i].Username == user.Username || users[i]["E-mail"] == user["E-mail"]){
            if(users[i].ID != user.ID){
                return true;
            }
        }
    }
}

function validUser(user){

    var isValid = true;

    if(user["Full Name"] == "" || user["Username"] == "" || user["E-mail"] == "" || user["Password"] == ""){
        isValid = false; 
    } 

    return isValid;
}

function displayError(message){
    var alertBox = document.getElementById("userAlert");
    alertBox.className = "alert alert-danger";
    alertBox.textContent = message;
}

function hideError(){
    var alertBox = document.getElementById("userAlert");
    alertBox.className = "alert alert-danger hide";
}
function create() {
    var newUser = {};
    newUser["Full Name"] = document.getElementById('fullName').value;
    newUser["Username"] = document.getElementById('username').value;
    newUser["E-mail"] = document.getElementById('email').value;
    newUser["Password"] = document.getElementById('password').value;
    
    var alertBox = document.getElementById("createUserAlert");

    if(!validUser(newUser)){
        displayError("All fields are required!");
        return;
    }

    if(userExists(newUser)){
        displayError("Username or E-mail already taken!");
        return;
    }

    newUser["ID"] = users[users.length-1].ID + 1;
    users.push(newUser);

    rebuildTable(users);
    navigate('list');
}

function rebuildTable(usersList){
    var table = document.getElementById("usersTable");

    if(table){
        var tablePage = document.getElementById("listContainer");
        tablePage.removeChild(table);
    }

    list(usersList);
}

function list(users) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");

    if(users.length < 1){
        return;
    }

    var fields = Object.keys(users[0]);
    var header = document.createElement("tr");
    fields.forEach(function (field) {
        var headerCell = document.createElement("th");
        headerCell.textContent = field;
        header.appendChild(headerCell);
    });
    var headerCell = document.createElement("th");
    header.appendChild(headerCell);
    thead.appendChild(header)
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    users.forEach(function (item) {
        var row = document.createElement("tr");
        fields.forEach(function (field) {
            var cell = document.createElement("td");
            if (field === "E-mail") {
                var anchor = document.createElement("a");
                var anchorText = document.createTextNode(item[field]);
                anchor.appendChild(anchorText);
                anchor.href = "#" + item[field];
                anchor.title = item[field];
                cell.appendChild(anchor);
            } else {
                cell.textContent = item[field];
            }
            row.appendChild(cell);
        });
        var controlsCell = document.createElement("td");

        var buttonGroup = document.createElement("div");
        buttonGroup.className = "btn-group";

        var editButton = document.createElement("button");
        editButton.className = "btn btn-default btn-xs";
        editButton.textContent = "Edit";
        editButton.onclick = editUser;

        var deleteButton =document.createElement("button");
        deleteButton.className = "btn btn-danger btn-xs";
        deleteButton.textContent = "Delete";
        deleteButton.onclick = deleteUser;

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        controlsCell.className += "controlsCell";
        controlsCell.appendChild(buttonGroup);
        row.appendChild(controlsCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    var tablePage = document.getElementById("listContainer");
    table.id = "usersTable";
    table.className += "table table-stripped table-hover";

    tablePage.appendChild(table);
    tablePage.appendChild(paginate(1, users));
}

function paginate(currentPage, users){
    var nav = document.createElement("nav");
    var ul = document.createElement("ul");
    ul.className = "pagination";
    
    var pages = Math.ceil(users.length / 10);
    for(var i = 1; i <= pages; i++){
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#";
        a.textContent = i;
        li.appendChild(a);
        ul.appendChild(li);
    }
    
    nav.appendChild(ul);
    return nav;
}

navigate("list");
list(users);