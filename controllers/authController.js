const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()

exports.register = async (req, res) => {
  const { username, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    })

    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    if (error.code === "P2002") {
      res.status(400).json({ error: "Username already exists" })
    } else {
      res.status(500).json({ error: "Something went wrong" })
    }
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid username or password" })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" })

    res.json({ token })
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" })
  }
}

