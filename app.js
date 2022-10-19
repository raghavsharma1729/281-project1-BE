import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { registerPerson, userLogin, getFiles, updateFile, removefile, addfile } from './controller/index.js';
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



app.post("/signup", registerPerson);

app.post("/login", userLogin);

app.post("/files", addfile);


app.put("/files/:id", updateFile);

app.delete("/files/:id", removefile);

app.get("/files", getFiles);


app.listen(8000, () => {
    console.log("Server running on port 8000")
});
