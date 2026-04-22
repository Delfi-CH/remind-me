import express from "express";

const app = express()
const port = 3000;
let db;

app.get("/api/remind-me/", (req, res) => {
    res.status(200).send("hello, world")
})

app.listen(port, "0.0.0.0", ()=>{
    console.log("remind-me server running on port " + port)

})