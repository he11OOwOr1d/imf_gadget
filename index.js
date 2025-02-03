require("dotenv").config()
const express = require("express")
const crypto = require("crypto")

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString("hex")
  console.log("Generated JWT_SECRET:", process.env.JWT_SECRET)
}

const gadgetRoutes = require("./routes/gadgetRoutes")
const authRoutes = require("./routes/authRoutes")
const errorHandler = require("./middleware/errorHandler")

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/api/gadgets", gadgetRoutes)
app.use("/api/auth", authRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

