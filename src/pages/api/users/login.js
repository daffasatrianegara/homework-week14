// pages/api/login.js

import bcrypt from 'bcryptjs';
const jwt = require('jsonwebtoken')
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const jwtToken = process.env.JWT_SECRET || "kode_rahasia_negara";

export default async function handlerLogin(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); 
  }

  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, jwtToken);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
