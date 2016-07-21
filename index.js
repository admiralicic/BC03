var users = [
    {ID: 1, "Full Name" : "Admir Alicic", Username: "admiralicic", "E-mail": "admir.alicic@gmail.com", Password: "test"},
    {ID: 2, "Full Name" : "Emir Alicic", Username: "emiralicic", "E-mail": "emir.alicic@gmail.com", Password: "test"},
    {ID: 3, "Full Name" : "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test"},
];

function navigate(state){
    var pages = document.getElementsByClassName("page");
    for(var i = 0; i < pages.length; i++){
        pages[i].id === state ? pages[i].className = "page container" : pages[i].className = " page container hiddenPage";
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

           rebuildTable();
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

function create() {
    var newUser = {};
    newUser["Full Name"] = document.getElementById('fullName').value;
    newUser["Username"] = document.getElementById('username').value;
    newUser["E-mail"] = document.getElementById('email').value;
    newUser["Password"] = document.getElementById('password').value;

    newUser["ID"] = users[users.length-1].ID + 1;
    users.push(newUser);

    // var table = document.getElementById("usersTable");

    // if(table){
    //     var tablePage = document.getElementById("listContainer");
    //     tablePage.removeChild(table);
    // }

    rebuildTable();
    // list(users);
    navigate('list');
}

function rebuildTable(){
    var table = document.getElementById("usersTable");

    if(table){
        var tablePage = document.getElementById("listContainer");
        tablePage.removeChild(table);
    }

    list(users);
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
}

navigate("list");
list(users);