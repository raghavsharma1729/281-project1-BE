import pool from './dbConnection.js';

export async function saveFile(file, user) {
    const { fileDescription, fileName, fileSize } = file;
    const userId = user.id;
    const url = "https://myprojectcmpe281.s3.us-west-1.amazonaws.com/" + fileName;
    const queryText = `
    INSERT INTO files (filename, filesize, description, url, "userId")
    VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const values = [fileName, fileSize, fileDescription, url, userId];
    return pool.query(queryText, values, (error, results) => {
        if (error) {
            throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
            throw error
        } return results.rows[0].id;
    });
}



export async function fetchFiles(user) {
    const values = [user.id];
    const queryText = user.admin ?
        'SELECT files.*, people.firstname, people.lastname FROM files INNER JOIN people ON "userId" = people.id' :
        `SELECT files.*, people.firstname, people.lastname FROM files INNER JOIN people ON "userId" = people.id WHERE "userId" = $1`;
    try {
        const results = await pool.query(queryText, values);
        return results.rows
    }
    catch (e) {
        throw e;
    }
}

export async function modifyFile(file, user) {
    const { fileDescription, id } = file;
    const queryText = `UPDATE files SET description = $1 , updated_at=now() WHERE id = $2`;
    const values = [fileDescription, id];

    return await pool.query(queryText, values, (error, results) => {
        if (error) {
            throw error
        }
    });
}

export async function deleteFile(file, user) {
    const { id } = file;
    const queryText = `DELETE FROM files WHERE id = $1`;
    const values = [id];
    return pool.query(queryText, values, (error, results) => {
        if (error) {
            throw error
        }
    });
}