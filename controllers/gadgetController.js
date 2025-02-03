const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const generateCodename = () => {
  const adjectives = ["Silent", "Invisible", "Quantum", "Sonic", "Phantom"]
  const nouns = ["Shadow", "Eagle", "Viper", "Ghost", "Phoenix"]
  return `The ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`
}

const generateMissionSuccessProbability = () => {
  return Math.floor(Math.random() * 41) + 60 
}

exports.getAllGadgets = async (req, res) => {
  const { status } = req.query
  let gadgets

  if (status) {
    gadgets = await prisma.gadget.findMany({ where: { status } })
  } else {
    gadgets = await prisma.gadget.findMany()
  }

  const gadgetsWithProbability = gadgets.map((gadget) => ({
    ...gadget,
    missionSuccessProbability: `${generateMissionSuccessProbability()}%`,
  }))

  res.json(gadgetsWithProbability)
}

exports.createGadget = async (req, res) => {
  const { name } = req.body
  const gadget = await prisma.gadget.create({
    data: {
      name,
      codename: generateCodename(),
      status: "Available",
    },
  })
  res.status(201).json(gadget)
}

exports.updateGadget = async (req, res) => {
  const { id } = req.params
  const { name, status } = req.body
  const gadget = await prisma.gadget.update({
    where: { id },
    data: { name, status },
  })
  res.json(gadget)
}

exports.deleteGadget = async (req, res) => {
  const { id } = req.params
  await prisma.gadget.update({
    where: { id },
    data: {
      status: "Decommissioned",
      decommissionedAt: new Date(),
    },
  })
  res.status(204).send()
}

exports.selfDestructGadget = async (req, res) => {
  const { id } = req.params
  const { confirmationCode } = req.body

  if (confirmationCode !== "CONFIRM-SELF-DESTRUCT") {
    return res.status(400).json({ error: "Invalid confirmation code" })
  }

  await prisma.gadget.update({
    where: { id },
    data: { status: "Destroyed" },
  })

  res.json({ message: "Gadget self-destruct sequence completed" })
}

