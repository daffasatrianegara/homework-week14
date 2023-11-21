const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret_key = process.env.JWT_SECRET || "kode_rahasia_negara";
const prisma = new PrismaClient();
if (prisma) {
  console.log("Connected to database");
} else {
  console.log("Could not connect to database");
}

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  try {
    const { email, password } = req.body;
    const user = await prisma.Users.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, secret_key);
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
