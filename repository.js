import pg from 'pg';
import jwt from './jwt.js';

const { Pool } = pg;

const credentials = {
    user: "postgres",
    host: "localhost",
    database: "nodedemo",
    password: "yourpassword",
    port: 5432,
};

const pool = new Pool(credentials);

const decodeToken = async (input) => {
    try {
        return await jwt.decodeJWT(input);
    } catch (e) {
        console.log(e);
    }
};

const verifyUser = async (request) => {
    return await decodeToken(request.headers.authorization);
}

export async function registerPerson(request, response) {
    const person = request.body;
    const text = `
    INSERT INTO users (firstName, lastName, email, password, admin)
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [person.firstName, person.lastName, person.email, person.password, false];
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
    const { fileDescription, fileName, fileSize } = request.body;
    const userId = user.id;
    const url = "cloudfrondistirbution" + fileName;
    const text = `
    INSERT INTO files (fileName,fileSize, description, url, userId)
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [fileName, fileSize, fileDescription, url, userId];
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        } response.status(201).send(`file created: ${results.rows[0].id}`)
    });
}


// async function getPerson(personId) {
//     const text = `SELECT * FROM people WHERE id = $1`;
//     const values = [personId];
//     return pool.query(text, values);
// }

export async function login(request, response) {
    const person = request.body;
    const text = `SELECT * FROM users WHERE email = $1 AND password = $2 `;
    const values = [person.email, person.password];
    const token = jwt.signJWT(
        {
            id: 'sdafdsf',
            firstName: 'Jhon',
            lastName: 'lark',
            email: 'email@mail.com',
            admin: true
        }
    );
    return response.status(200).send({ jwtToken: token });
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        }
        const user = results.rows[0];
        const token = jwt.signJWT(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.lastName,
                admin: user.admin
            }
        );
        response.status(200).send({ jwtToken: token })
    });
}

export async function getFiles(request, response) {
    // jwt token decode and fetch userId
    const user = await verifyUser(request);
    console.log(user);
    const values = [user.id];
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
    return response.status(200).json(demoData);
    const text = user.admin ? 'SELECT * FROM files' : `SELECT * FROM files WHERE userid = $1`;
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

// async function updatePersonName(personId, fullname) {
//     const text = `UPDATE people SET fullname = $2 WHERE id = $1`;
//     const values = [personId, fullname];
//     return pool.query(text, values);
// }

export async function updateFile(request, response) {
    //fetch userid from jwt token
    const user = await verifyUser(request);
    const userId = user.id;
    const { id } = request.params;
    const { description } = request.body;
    const text = `UPDATE files SET description = $2 WHERE id = $1 AND userid = $3`;
    const values = [id, description, userId];
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ message: 'file updated' })
    });
}

// async function removePerson(personId) {
//     const text = `DELETE FROM people WHERE id = $1`;
//     const values = [personId];
//     return pool.query(text, values);
// }
export async function removefile(request, response) {
    const user = await verifyUser(request);
    const { id } = request.params;
    const text = `DELETE FROM files WHERE id = $1 AND userId = $2`;
    const values = [id, user.id];
    return pool.query(text, values, (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send({ message: 'file deleted' })
    });
}