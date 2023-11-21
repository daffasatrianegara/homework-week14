const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
require("dotenv").config();

const prisma = new PrismaClient();
if (prisma) {
  console.log("Connected to database");
} else {
  console.log("Could not connect to database");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, Date.now() + "-" + fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB limit
});

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      upload.single("image")(req, res, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Error uploading file..." });
        }

        const { title, author, publisher, year, pages } = req.body;
        const addBook = await prisma.Book.create({
          data: {
            title,
            author,
            publisher,
            year: parseInt(year),
            pages: parseInt(pages),
            image: req.file.path.split("public")[1],
          },
        });

        res.json({ addBook });
      });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: "internal server error..." });
    }
  } else if (req.method === "GET") {
    try {
      const books = await prisma.Book.findMany();
      res.json(books);
    } catch (e) {
      return res.status(500).json({ message: "internal server error..." });
    }
  } else {
    return res.status(500).json({ message: "internal server error..." });
  }
};

export default handler;
export const config = {
  api: {
    bodyParser: false,
  },
};
