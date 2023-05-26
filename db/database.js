import mysql from "mysql2";
import { config } from "../config.js";

const { host, user, database, password ,port} = config.db;

const pool = mysql.createPool({
    host,
    user,
    database,
    password,
    port
});

const testConnection = async () => {
  try {
    const connection = await pool.promise().getConnection();
    console.log("Successfully connected to the hosted DB!");
    connection.release();
  } catch (error) {
    console.error("Failed to connect to the hosted DB:", error);
  }
};

testConnection();

export const db = pool.promise();







