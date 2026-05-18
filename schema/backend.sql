CREATE DATABASE mydb;

\c mydb;

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount INT,
    description VARCHAR(255)
);