import { pool, initDB_Express, createUser_Express, getUser_Express, addDevice_Express, deleteDevice_Express } from "../lib/database/db_express.js";
import express from "express";

const app = express()
app.use(express.json())
const port = 3000;

app.get("/api/remind-me/", (req, res) => {
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


app.listen(port, "0.0.0.0", async ()=>{
    console.log("remind-me server running on port " + port)
    await initDB_Express()
})

process.on("SIGINT", async () => {
    await pool.end();
    process.exit(0);
});