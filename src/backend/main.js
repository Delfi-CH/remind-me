import { pool, initDB_Express, createUser_Express, getUser_Express, addDevice_Express, deleteDevice_Express, generateSyncCode_Express, deleteOldSyncCodes_Express } from "../lib/database/db_express.js";
import express from "express";
import cors from "cors";
import cron from "node-cron"

const app = express()
app.use(express.json())
app.use(cors());
const port = 3000;

app.get("/api/remind-me", (req, res) => {
    res.status(200).send("hello, world")
})

app.post("/api/remind-me/signup", async (req, res) => {
    const uuid = req.body.uuid
    const result = await createUser_Express(uuid)
    if (result) {
        res.sendStatus(201)
        return
    } else {
        res.sendStatus(409)
        return
    }
})
// curl -X POST http://localhost:3000/api/remind-me/signup -H "Content-Type: application/json" -d '{"uuid":69}'

app.get("/api/remind-me/users/:uuid", async (req, res)=>{
    const uuid = req.params.uuid;
    const exists = await getUser_Express(uuid)
    if (exists === false || exists.length === 0) {
        res.sendStatus(404)
        return
    } else {
        res.send(exists)
    }
})
// curl http://localhost:3000/api/remind-me/users/69

app.post("/api/remind-me/users/:uuid/device", async (req,res)=> {
    const uuid = req.params.uuid;
    const device = req.body.device;
    const result = await addDevice_Express(uuid, device)
     if (result) {
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})
// curl -X POST http://localhost:3000/api/remind-me/users/69/device/ -H "Content-Type: application/json" -d '{"device":"computer"}'

app.post("/api/remind-me/users/:uuid/device/delete", async (req,res)=> {
    const uuid = req.params.uuid;
    const device = req.body.device;
    const result = await deleteDevice_Express(uuid, device)
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
    const pin = await generateSyncCode_Express(uuid)
    if (pin === 0) {
        res.status(409).send("PIN already exists for your user")
    }
    res.status(201).send({pin: pin})
})

cron.schedule("* * * * *", async ()=> {
    await deleteOldSyncCodes_Express()
})

app.listen(port, "0.0.0.0", async ()=>{
    console.log("remind-me server running on port " + port)
    await initDB_Express()
})

process.on("SIGINT", async () => {
    await pool.end();
    process.exit(0);
});