import { initDB_Express, createUser_Express, getUser_Express, addDevice_Express, deleteDevice_Express, generateSyncCode_Express, deleteOldSyncCodes_Express, validateSyncPin_Express } from "../lib/database/db_express.js";
import { Pool } from "pg";
import express from "express";
import cors from "cors";
import cron from "node-cron"
import { readIniSync } from "@delfi-ch/ini.js/fs";

const app = express()
app.use(express.json())
app.use(cors());

const config = readIniSync("config.ini");

const pool = new Pool({
    user: config.database.pg_user,
    password: config.database.pg_password,
    host: config.database.pg_host,
    port: config.database.pg_port,
    database: config.database.pg_database,
    max: 10,
    idleTimeoutMillis: 30000
});

const port = config.backend.port;

app.get("/api/remind-me", (req, res) => {
    res.status(200).send("hello, world")
})

app.post("/api/remind-me/signup", async (req, res) => {
    const uuid = req.body.uuid
    const result = await createUser_Express(uuid, pool)
    if (result) {
        res.sendStatus(201)
        return
    } else {
        res.sendStatus(409)
        return
    }
})
// curl -X POST http://localhost:3000/api/remind-me/signup -H "Content-Type: application/json" -d '{"uuid":69}'

app.get("/api/remind-me/users/:uuid", async (req, res) => {
    const uuid = req.params.uuid;
    const exists = await getUser_Express(uuid, pool)
    if (exists === false || exists.length === 0) {
        res.sendStatus(404)
        return
    } else {
        res.send(exists)
    }
})
// curl http://localhost:3000/api/remind-me/users/69

app.post("/api/remind-me/users/:uuid/device", async (req, res) => {
    const uuid = req.params.uuid;
    const device = req.body.device;
    const result = await addDevice_Express(uuid, device, pool)
    if (result) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})
// curl -X POST http://localhost:3000/api/remind-me/users/69/device/ -H "Content-Type: application/json" -d '{"device":"computer"}'

app.post("/api/remind-me/users/:uuid/device/delete", async (req, res) => {
    const uuid = req.params.uuid;
    const device = req.body.device;
    const result = await deleteDevice_Express(uuid, device, pool)
    if (result) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})
// curl -X POST http://localhost:3000/api/remind-me/users/69/device/delete -H "Content-Type: application/json" -d '{"device":"computer"}'

app.post("/api/remind-me/users/:uuid/sync", async (req, res) => {
    const uuid = req.params.uuid
    const pin = await generateSyncCode_Express(uuid, pool)
    if (pin === 0) {
        res.status(409).send("PIN already exists for your user")
    }
    res.status(201).send({ pin: pin })
})

// curl -X POST http://localhost:3000/api/remind-me/users/69/syncx  

app.post("/api/remind-me/pins/:pin/login", async (req, res) => {
    const syncPin = req.params.pin
    const uuid = await validateSyncPin_Express(syncPin, pool)
    if (uuid === 0) {
        res.sendStatus(404)
        return
    }
    res.send({ uuid: uuid })
})

cron.schedule("* * * * *", async () => {
    console.log("Deleting old Sync Pins")
    await deleteOldSyncCodes_Express(pool)
})

app.listen(port, "0.0.0.0", async () => {
    console.log("remind-me server running on port " + port)
    await initDB_Express(pool)
})

process.on("SIGINT", async () => {
    await pool.end();
    process.exit(0);
});