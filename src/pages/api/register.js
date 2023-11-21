const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  const { name, email, password } = req.body
  try {
    const hashPass = await bcrypt.hash(password, 10)
    const addUser = await prisma.Users.create({
        data : {
            name : name,
            email : email,
            password : hashPass
        }
    })
    res.status(201).json(addUser);
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default handler;
