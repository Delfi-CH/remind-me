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

        await pool.query(`
            CREATE TABLE IF NOT EXISTS syncPins (
                id SERIAL PRIMARY KEY,
                userFK INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                syncPin INTEGER NOT NULL,
                createdAt TIMESTAMP NOT NULL DEFAULT NOW()
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
            const devices = (await pool.query("SELECT deviceString FROM devices WHERE userFK = $1", [userId[0].id])).rows
            if (devices.some(d => d.devicestring === JSON.stringify(device))) {
                return true
            }
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

export async function generateSyncCode_Express(uuid) {
    try {
        const rand = new Uint16Array(1)
        crypto.getRandomValues(rand)
        const pin = rand[0]
        const res = await pool.query("SELECT users.id FROM users WHERE users.uuid = $1", [uuid])
        const userId = res.rows[0].id
        const queryText = `
            INSERT INTO syncPins(userFK, syncPin) VALUES ($1, $2)
        `
        await pool.query(queryText, [userId, pin])
        return pin

    } catch (e) {
        console.error("Pin generation failed: " +e)
        return 0
    }
}

export async function deleteOldSyncCodes_Express() {
    try {
        await pool.query("DELETE from syncPins WHERE createdAt <= NOW() - INTERVAL '15 minutes'")
    } catch (e) {
        console.error("Could not delete old sync codes: " + e)
    }
}

export async function validateSyncPin_Express(syncPin) {
    try {
        const res = await pool.query("SELECT syncPins.userFK FROM syncPins WHERE syncPin = $1", [syncPin])
        const res2 = await pool.query("SELECT users.uuid FROM users WHERE id = $1", [res.rows[0].userfk])
        return res2.rows[0].uuid
    } catch (e) {
        console.error("Invalid sync pin: " + e)
        return 0
    }
}