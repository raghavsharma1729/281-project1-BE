// const express = require('express');
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// const cors = require('cors');
// const bodyParser = require('body-parser');
import { registerPerson, login, getFiles, updateFile, removefile, addfile } from './repository.js';
// const { Pool, Client } = require("pg");
// import pg from 'pg';
// const { Pool, Client } = pg;
// //
// const credentials = {
//     user: "postgres",
//     host: "localhost",
//     database: "nodedemo",
//     password: "yourpassword",
//     port: 5432,
// };


// async function poolDemo() {
//     const pool = new Pool(credentials);
//     const now = await pool.query("SELECT * from user");
//     await pool.end();

//     return now;
// }

// // Connect with a client.

// async function clientDemo() {
//     const client = new Client(credentials);
//     await client.connect();
//     const now = await client.query("SELECT NOW()");
//     await client.end();

//     return now;
// }

//Use a self - calling function so we can use async / await.

// (async () => {
//     const poolResult = await poolDemo();
//     console.log("Time with pool: " + poolResult.rows[0]["now"]);

//     const clientResult = await clientDemo();
//     console.log("Time with client: " + clientResult.rows[0]["now"]);
// })();


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const DEF_DELAY = 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}

// app.post("/signup", async (req, res) => {
//     await registerPerson(req.body);
//     res.send(201, { message: 'user signed up' });
// });
app.post("/signup", registerPerson);

// app.post("/login", async (req, res) => {
//     console.log(req.body);
//     await sleep(1000);
//     if (req.body.email == "96raghavsharma@gmail.com") {
//         res.send(200, { message: 'user logged in sucessfully', jwtToken: 'abchdkjaob' });
//     }
//     else {
//         res.send(401, { message: 'email or password is incorrect' });
//     }
// });
app.post("/login", login);

// app.post("/files", async (req, res) => {
//     console.log(req.body);
//     await sleep(1000);
//     res.send(201, { message: 'Files uploaded sucessfully', data: req.body });
// });
app.post("/files", addfile);

// app.put("/files/:id", async (req, res) => {
//     const { id } = req.params;
//     console.log(req.body, { id });
//     await sleep(1000);
//     res.send(200, { message: `Files updated sucessfully ${id}`, data: req.body });
// });

app.put("/files/:id", updateFile);

// app.delete("/files/:id", async (req, res) => {
//     const { id } = req.params;
//     console.log(req.body, { id });
//     await sleep(1000);
//     res.send(200, { message: `Files deleted sucessfully ${id}`, data: req.body });
// });
app.delete("/files/:id", removefile);


const demoData = [{
    id: "12938942",
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
}, {
    id: "12938942",
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
},
{
    id: "12938942",
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
}];

// app.get("/files", (req, res) => {
//     res.send(200, demoData);
// });

app.get("/files", getFiles);


app.listen(8000, () => {
    console.log("Server running on port 8000")
});
