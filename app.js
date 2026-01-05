const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());


function getUsers() {
    const data = fs.readFileSync("users.json", "utf-8");
    return JSON.parse(data);
}


function saveUsers(users) {
    fs.writeFileSync("users.json", JSON.stringify(users, "", 2));
}


app.get("/users", (req, res) => {
    res.json(getUsers());
});

// app.get("/users/search", (req, res) => {
//     const { city, name } = req.query;
//     const users = getUsers();

//     let result = users;

   
//     if (city) {
//         result = result.filter(u =>
//             u.city.toLowerCase() === city.toLowerCase()
//         );
//     }


//     if (name) {
//         result = result.filter(u =>
//             u.name.toLowerCase() === name.toLowerCase()
//         );
//     }

//     res.json(result);
// });


app.get("/users/search", (req, res) => {
    const { city } = req.query;

    if (!city) {
        return res.status(400).json({ message: "City query is required" });
    }

    const users = getUsers();
    const result = users.filter(
        u => u.city.toLowerCase().trim() === city.toLowerCase().trim() 
    );

    return result.length
        ? res.json(result)
        : res.status(404).json({ message: "User not found" });
});

app.get("/users/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const users = getUsers();

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});


app.post("/users", (req, res) => {
    const users = getUsers();
    const newUsers = [];

    const input = Array.isArray(req.body) ? req.body : [req.body];

    for (let obj of input) {
        const { name, city } = obj;

        if (!name || !city) {
            
            continue;
        }

        const newUser = {
            id: users.length ? users[users.length - 1].id + 1 : 1,
            name,
            city
        };

        users.push(newUser);
        newUsers.push(newUser);
    }

    saveUsers(users);

    res.status(201).json(newUsers);
});


app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
