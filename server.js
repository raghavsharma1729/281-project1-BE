import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { registerPerson, login, getFiles, updateFile, removefile, addfile } from './repository.js';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



app.post("/signup", registerPerson);

app.post("/login", login);

app.post("/files", addfile);


app.put("/files/:id", updateFile);

app.delete("/files/:id", removefile);

app.get("/files", getFiles);


app.listen(8000, () => {
    console.log("Server running on port 8000")
});
