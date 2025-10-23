const express = require("express");;
const rootRouter = require("./api/index");
var cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());


app.get("/api/v1",rootRouter);

app.listen("3000",(req,res)=>{
    console.log("Server started at port",3000);
})




// app.post("/update",(req,res)=>{
//     return res.json({
//         msg:"You are currently in update route"
//     })
// })
