require("dotenv").config()
const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const crypto = require("crypto")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = crypto.randomBytes(64).toString("hex")
  console.log("Generated JWT_SECRET:", process.env.JWT_SECRET)
}

async function generateToken() {
  const testPassword = "password123"
  const hashedPassword = await bcrypt.hash(testPassword, 10)


  let user = await prisma.user.findUnique({ where: { username: "testuser" } })

  if (!user) {
    user = await prisma.user.create({
      data: {
        username: "testuser",
        password: hashedPassword,
      },
    })
    console.log("Created test user:", user.username)
  } else {

    user = await prisma.user.update({
      where: { username: "testuser" },
      data: { password: hashedPassword },
    })
    console.log("Updated test user password")
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })
  console.log("Generated token:", token)
  console.log("Test user credentials:")
  console.log("Username: testuser")
  console.log("Password:", testPassword)

  await prisma.$disconnect()
}

generateToken().catch(console.error)

