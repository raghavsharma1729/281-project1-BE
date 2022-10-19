import pg from 'pg';

const { Pool } = pg;

const credentials = {
    user: "postgres",
    host: "cmpe281db1.cncm2iq9iv0e.us-west-1.rds.amazonaws.com",
    database: "project-1",
    password: "po$$W1234",
    port: 5432,
};

const pool = new Pool(credentials);

export default pool;