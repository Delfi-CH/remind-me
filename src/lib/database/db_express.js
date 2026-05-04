import { Pool } from "pg";

export const pool = new Pool({
    user: "remind_me",
    password: "remind-me",
    host: "localhost",
    port: 5432,
    database: "remind_me",
    max: 10,
    idleTimeoutMillis: 30000
});

export async function initDB_Express() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                uuid TEXT UNIQUE NOT NULL
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS reminders (
                id SERIAL PRIMARY KEY,
                reminderTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                message TEXT NOT NULL DEFAULT 'message',
                userFK INTEGER REFERENCES users(id) ON DELETE CASCADE
            );
        `);

        await pool.query(`
            CREATE TABLE IF NOT EXISTS devices (
                id SERIAL PRIMARY KEY,
                deviceString TEXT NOT NULL,
                userFK INTEGER REFERENCES users(id) ON DELETE CASCADE
            );
        `);

    } catch (err) {
        console.error("DB init failed:", err);
        throw err;
    }
}

export async function createUser_Express(uuid) {
    try {
        const queryText = "INSERT INTO users(uuid) VALUES($1)"
        await pool.query(queryText, [uuid])
        return true
    } catch (e) {
        console.error("Insert failed: " +e)
        return false
    }
}

export async function addDevice_Express(uuid, device) {
    try {
        const userId = (await pool.query("SELECT id FROM users WHERE uuid = $1", [uuid])).rows
        if (userId.length === 0) {
            return false
        } else {
            const queryText = "INSERT INTO devices(deviceString, userFK) VALUES ($1, $2)"
            await pool.query(queryText, [device, userId[0].id])
            return true
        }
    } catch (e) {
        console.error("Insert failed: " +e)
        return false
    }   
}

export async function deleteDevice_Express(uuid, device) {
    try {
        const userId = (await pool.query("SELECT id FROM users WHERE uuid = $1", [uuid])).rows
        if (userId.length === 0) {
            return false
        } else {
            const queryText = "DELETE FROM devices WHERE userFK = $1 AND deviceString = $2"
            await pool.query(queryText, [userId[0].id, device])
            return true
        }
    } catch (e) {
        console.error("Delete failed: " +e)
        return false
    }  
}

export async function getUser_Express(uuid) {
    try {
        const queryText = `
            SELECT 
                users.uuid,
                COALESCE(
                    json_agg(devices.deviceString) FILTER (WHERE devices.id IS NOT NULL),
                    '[]'
                ) AS devices
            FROM users
            LEFT JOIN devices ON devices.userFK = users.id
            WHERE users.uuid = $1
            GROUP BY users.id, users.uuid
        `
        const res = await pool.query(queryText, [uuid])
        return res.rows
    } catch(e) {
        console.error("Select failed: " +e)
        return false
    } 
}