CREATE DATABASE transactions;

\c transactions;

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount INT,
    description VARCHAR(255)
);