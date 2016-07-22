
var currentPage = 1;
var pageSize = 5;
var users = [];

var seedUsers = [
    { ID: 1, "Full Name": "Admir Alicic", Username: "admiralicic", "E-mail": "admir.alicic@gmail.com", Password: "test" },
    { ID: 2, "Full Name": "Emir Alicic", Username: "emiralicic", "E-mail": "emir.alicic@gmail.com", Password: "test" },
    { ID: 3, "Full Name": "Haris Alicic", Username: "harisalicic", "E-mail": "haris.alicic@gmail.com", Password: "test" },
    { ID: 4, "Full Name": "John Wayne", Username: "johnw", "E-mail": "johnw@gmail.com", Password: "test" },
    { ID: 5, "Full Name": "John Malkovich", Username: "malkovich", "E-mail": "malkovich@gmail.com", Password: "test" },
    { ID: 6, "Full Name": "Bruce Willis", Username: "willisb", "E-mail": "willisb@gmail.com", Password: "test" },
    { ID: 7, "Full Name": "Scarlet Johansson", Username: "scarlet", "E-mail": "scarlet@gmail.com", Password: "test" },
    { ID: 8, "Full Name": "Salma Hayek", Username: "salma", "E-mail": "salma@gmail.com", Password: "test" },
    { ID: 9, "Full Name": "Brad Pitt", Username: "presto", "E-mail": "presto@gmail.com", Password: "test" },
    { ID: 10, "Full Name": "Angelina Jolie", Username: "angie", "E-mail": "angie@gmail.com", Password: "test" },
    { ID: 11, "Full Name": "Heather Graham", Username: "gheader", "E-mail": "gheader@gmail.com", Password: "test" },
    { ID: 12, "Full Name": "Collin Powell", Username: "collinp", "E-mail": "collinp@gmail.com", Password: "test" },
    { ID: 13, "Full Name": "Mike Oldfield", Username: "mikeo", "E-mail": "mikeo@gmail.com", Password: "test" },
];

function navigate(state) {
    hideError();
    var pages = document.getElementsByClassName("page");
    for (var i = 0; i < pages.length; i++) {
        pages[i].id === state ? pages[i].className = "page container" : pages[i].className = " page container hiddenPage";
    }

}

function search(event) {
    if (event.keyCode === 13) {
        var criteria = event.target.value.toLowerCase();
        var filteredUsers = users.filter(function (user) {
            if (user["Full Name"].toLowerCase().indexOf(criteria) > -1 || user.Username.toLowerCase().indexOf(criteria) > -1) {
                return user;
            }
        });
        currentPage = 1;
        rebuildTable(filteredUsers);
    }
}

function editUser(event) {
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

function updateUser() {
    for (var i = 0; i < users.length; i++) {
        if (users[i].ID === parseInt(document.getElementById("userId").value)) {
            users[i]["Full Name"] = properCase(document.getElementById("editFullName").value);
            users[i]["Username"] = document.getElementById("editUsername").value.toLowerCase();
            users[i]["E-mail"] = document.getElementById("editEmail").value.toLowerCase();
            users[i]["Password"] = document.getElementById("editPassword").value;

            if (!validUser(users[i])) {
                displayError("All fields are required!");
                return;
            }

            if (userExists(users[i])) {
                displayError("Username or E-mail already taken!");
                return;
            }

            saveData(users);
            rebuildTable(users);
            break;
        }
    }

    navigate("list");
}

function deleteUser(event) {
    if (confirm("Are you sure you want to delete a user")) {
        var btn = event.target;
        var row = btn.parentElement.parentElement.parentElement;

        for (var i = 0; i < users.length; i++) {
            if (users[i]["E-mail"] === rowData(row).email) {
                users.splice(i, 1);

                var tbody = document.getElementsByTagName("tbody")[0];
                tbody.removeChild(row);
                saveData(users);
                break;
            }
        }

    }
}

function rowData(row) {
    return {
        id: row.childNodes[0].textContent,
        fullName: row.childNodes[1].textContent,
        username: row.childNodes[2].textContent,
        email: row.childNodes[3].textContent,
        password: row.childNodes[4].textContent,
    }
}

function userExists(user) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].Username == user.Username || users[i]["E-mail"] == user["E-mail"]) {
            if (users[i].ID != user.ID) {
                return true;
            }
        }
    }
}

function validUser(user) {

    var isValid = true;

    if (user["Full Name"] == "" || user["Username"] == "" || user["E-mail"] == "" || user["Password"] == "") {
        isValid = false;
    }

    return isValid;
}

function displayError(message) {
    var alertBox = document.getElementById("userAlert");
    alertBox.className = "alert alert-danger";
    alertBox.textContent = message;
}

function hideError() {
    var alertBox = document.getElementById("userAlert");
    alertBox.className = "alert alert-danger hide";
}

function properCase(str){
    words = str.split(" ");
    for (var i = 0; i < words.length; i++){
        words[i] = words[i].charAt(0).toUpperCase() + words[i].substring(1).toLowerCase();
    }

    return words.join(" ");
}

function create() {
    var newUser = {};
    newUser["Full Name"] = properCase(document.getElementById('fullName').value);
    newUser["Username"] = document.getElementById('username').value.toLowerCase();
    newUser["E-mail"] = document.getElementById('email').value.toLowerCase();
    newUser["Password"] = document.getElementById('password').value;

    var alertBox = document.getElementById("createUserAlert");

    if (!validUser(newUser)) {
        displayError("All fields are required!");
        return;
    }

    if (userExists(newUser)) {
        displayError("Username or E-mail already taken!");
        return;
    }

    newUser["ID"] = users[users.length - 1].ID + 1;
    users.push(newUser);

    saveData(users);
    rebuildTable(users);
    navigate('list');
}

function rebuildTable(usersList) {
    var table = document.getElementById("usersTable");
    var pagination = document.getElementById("pagination")

    if (table) {
        var tablePage = document.getElementById("listContainer");
        tablePage.removeChild(table);
        tablePage.removeChild(pagination);
    }

    list(usersList, currentPage);
}

function list(users, page) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");

    if (users.length < 1) {
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
    var pagedUsers = users.slice((page - 1) * pageSize, page * pageSize);
    pagedUsers.forEach(function (item) {
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

        var deleteButton = document.createElement("button");
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

function paginate(currentPage, users) {
    var nav = document.createElement("nav");
    var ul = document.createElement("ul");
    ul.className = "pagination";

    var pages = Math.ceil(users.length / pageSize);
    for (var i = 1; i <= pages; i++) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#";
        a.textContent = i;
        a.onclick = goToPage;
        li.appendChild(a);
        ul.appendChild(li);
    }

    nav.appendChild(ul);
    nav.id = "pagination";
    return nav;
}

function goToPage(event){
    currentPage = parseInt(event.target.textContent);
    rebuildTable(users);
}

function saveData(data){
    window.localStorage.setItem("users", JSON.stringify(data));
}

function getData(){
    data = window.localStorage.getItem("users");
    return JSON.parse(data);
}

function seed(){
    if(!getData()){
        saveData(seedUsers);
    }
}

seed();
users = getData();

navigate("list");

list(users, currentPage);


