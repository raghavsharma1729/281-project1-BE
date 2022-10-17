const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');



const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const DEF_DELAY = 1000;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms || DEF_DELAY));
}


app.post("/signup", (req, res) => {
    res.send(201, { message: 'user signed up' });
});
app.post("/login", async (req, res) => {
    console.log(req.body);
    await sleep(1000);
    if (req.body.email == "96raghavsharma@gmail.com") {
        res.send(200, { message: 'user logged in sucessfully', jwtToken: 'abchdkjaob' });
    }
    else {
        res.send(401, { message: 'email or password is incorrect' });
    }
});

app.get("/", (req, res) => {
    res.send(200, { message: 'ok' });
});
const demoData = [{
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
}, {
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
},
{
    firstName: 'Jhon',
    lastName: 'lark',
    uploadTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    description: 'Important file',
    url: 'http://abcd.com/file'
}];

app.get("/files", (req, res) => {
    res.send(200, demoData);
});


app.listen(8000, () => {
    console.log("Server running on port 8000")
});
