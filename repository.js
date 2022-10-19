import pg from 'pg';
import jwt from './jwt.js';

const { Pool } = pg;

const credentials = {
    user: "postgres",
    host: "cmpe281db1.cncm2iq9iv0e.us-west-1.rds.amazonaws.com",
    database: "project-1",
    password: "po$$W1234",
    port: 5432,
};
process.env.DB_NAME;
const pool = new Pool(credentials);

const decodeToken = async (input) => {
    try {
        return await jwt.decodeJWT(input);
    } catch (e) {
        console.log(e);
    }
};

const verifyUser = async (request) => {
    const token = await decodeToken(request.headers.authorization);
    return token.data;
}

export async function registerPerson(request, response) {
    const person = request.body;
    const values = [person.firstname, person.lastname, person.email, person.password, false];
    const text = `
    INSERT INTO "people" ("firstname", "lastname", "email", "pass", "admin")
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        } response.status(201).send(`User signed up: ${results.rows[0].id}`)
    });
}

export async function addfile(request, response) {
    const user = await verifyUser(request);
    console.log(user);
    const { fileDescription, fileName, fileSize } = request.body;
    const userId = user.id;
    const url = "http://cloudfrondistirbution" + fileName;
    const text = `
    INSERT INTO files (filename, filesize, description, url, "userId")
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [fileName, fileSize, fileDescription, url, userId];
    console.log(values);
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        } response.status(201).send(`file created: ${results.rows[0].id}`)
    });
}

export async function login(request, response) {
    const person = request.body;
    const text = `SELECT * FROM people WHERE email = $1 AND pass = $2 `;
    const values = [person.email, person.password];
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        }

        const user = results.rows[0];
        const userDetails = {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.lastname,
            admin: user.admin
        };
        const token = jwt.signJWT(
            userDetails
        );
        response.status(200).send({ jwtToken: token, user: userDetails })
    });
}

export async function getFiles(request, response) {
    const user = await verifyUser(request);
    console.log(user);
    const values = [user.id];
    const text = user.admin ? 'SELECT files.*, people.* FROM files INNER JOIN people ON "userId" = people.id' : `SELECT files.*, people.firstname, people.lastname FROM files INNER JOIN people ON "userId" = people.id WHERE "userId" = $1`;
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

export async function updateFile(request, response) {
    const user = await verifyUser(request);
    const userId = user.id;
    const { id } = request.params;
    const { fileDescription } = request.body;
    const text = `UPDATE files SET description = $1 , updated_at=now() WHERE id = $2 AND "userId" = $3`;
    const values = [fileDescription, id, userId];
    console.log(values);
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ message: 'file updated' })
    });
}

export async function removefile(request, response) {
    const user = await verifyUser(request);
    const { id } = request.params;
    const text = `DELETE FROM files WHERE id = $1 AND "userId" = $2`;
    const values = [id, user.id];
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ message: 'file deleted' })
    });
}