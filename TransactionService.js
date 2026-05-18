const dbcreds = require('./DbConfig');
const { Pool } = require('pg');

const con = new Pool({
    host: process.env.DB_HOST || dbcreds.DB_HOST,
    user: process.env.DB_USER || dbcreds.DB_USER,
    password: process.env.DB_PWD || dbcreds.DB_PWD,
    database: process.env.DB_DATABASE || dbcreds.DB_DATABASE,
    port: process.env.DB_PORT || dbcreds.DB_PORT || 5432 
});

function addTransaction(amount, desc) {
    // 1. Removed backticks. 2. Used $1, $2 for parameters.
    const sql = `INSERT INTO transactions (amount, description) VALUES ($1, $2)`;
    con.query(sql, [amount, desc], function(err, result) {
        if (err) {
            console.error("Error adding transaction:", err);
            return;
        }
    }); 
    return 200;
}

function getAllTransactions(callback) {
    const sql = "SELECT * FROM transactions";
    con.query(sql, function(err, result) {
        if (err) throw err;
        // 3. IMPORTANT: Use result.rows for PostgreSQL
        return callback(result.rows);
    });
}

function findTransactionById(id, callback) {
    const sql = `SELECT * FROM transactions WHERE id = $1`;
    con.query(sql, [id], function(err, result) {
        if (err) throw err;
        // 3. Return only the first row found
        return callback(result.rows[0]);
    }); 
}

function deleteAllTransactions(callback) {
    const sql = "DELETE FROM transactions";
    con.query(sql, function(err, result) {
        if (err) throw err;
        return callback(result);
    }); 
}

function deleteTransactionById(id, callback) {
    const sql = `DELETE FROM transactions WHERE id = $1`;
    con.query(sql, [id], function(err, result) {
        if (err) throw err;
        return callback(result);
    }); 
}

module.exports = {
    addTransaction,
    getAllTransactions,
    findTransactionById,
    deleteAllTransactions,
    deleteTransactionById
};