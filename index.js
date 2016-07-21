var users = [];

function create() {
    var newUser = {};
    newUser["Full Name"] = document.getElementById('fullName').value;
    newUser["Username"] = document.getElementById('username').value;
    newUser["E-mail"] = document.getElementById('email').value;
    newUser["Password"] = document.getElementById('password').value;

    users.push(newUser);

    var table = document.getElementById("usersTable");

    if(table){
        var tablePage = document.getElementById("list");
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

        var deleteButton =document.createElement("button");
        deleteButton.className = "btn btn-danger btn-xs";
        deleteButton.textContent = "Delete";

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);
        controlsCell.appendChild(buttonGroup);
        row.appendChild(controlsCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    var tablePage = document.getElementById("list");
    table.id = "usersTable";
    table.className += "table";

    tablePage.appendChild(table);
}

list(users);