-- Create the groups table
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create the users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  deadline DATE,
  done BOOLEAN DEFAULT FALSE,
  group_id INTEGER REFERENCES groups (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);

INSERT INTO users (username, password) VALUES ('test', 'b1acabc404ab2f2df294cda957a76373');
INSERT INTO groups (id, name) VALUES (0, 'all tasks'); 

CREATE DATABASE test;

\c test;

-- Create the groups table
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

-- Create the users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Create the tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  deadline DATE,
  done BOOLEAN DEFAULT FALSE,
  group_id INTEGER REFERENCES groups (id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users (id) ON DELETE CASCADE
);
