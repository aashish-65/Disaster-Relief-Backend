const dotenv = require("dotenv")
dotenv.config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const verifyHMAC = require("./middlewares/VerifySignature")
const apiRoutes = require("./routes/api")

const app = express()

app.use(cors())
app.use(express.json())
// app.use(verifyHMAC)

app.use("/api", apiRoutes)

mongoose.set('strictQuery', false);
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, (err) => {
        if (err) {
            console.log(err)
        } 
        else {
            console.log(`Server is running on port ${process.env.PORT}`)
        }
    }
)
}).catch(err => {
    console.log(err)
})
