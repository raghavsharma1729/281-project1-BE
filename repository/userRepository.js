import pool from './dbConnection.js';


export async function addUser(person) {
    const values = [person.firstname, person.lastname, person.email, person.password, false];
    const text = `
    INSERT INTO "people" ("firstname", "lastname", "email", "pass", "admin")
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    try {
        const results = await pool.query(text, values);
        if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        }
        return results.rows[0].id
    } catch (e) {
        throw e;
    }
}


export async function login(person) {
    const text = `SELECT * FROM people WHERE email = $1 AND pass = $2 `;
    const values = [person.email, person.password];
    try {
        const result = await pool.query(text, values);
        if (!Array.isArray(result.rows) || result.rows.length < 1) {
            throw error
        }
        return result.rows[0];
    }
    catch (e) {
        throw e;
    }
}