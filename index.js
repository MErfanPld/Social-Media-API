const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const router = express.Router();

const app = express();

//? ENV
dotenv.config();

//? CONNECT MONGODB
mongoose
  .connect("mongodb://127.0.0.1:27017/social_media")
  //   .connect(process.env.MONGO_URL)
  .then(console.log("Connecting to database ..."))
  .catch((err) => console.log(err));

//? STATIC
app.use("/images", express.static(path.join(__dirname, "public/images")));

//? MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//? STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

//? ROUTES
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);


app.use(
  '/api-docs',
  swaggerUi.serve, 
  swaggerUi.setup(swaggerDocument)
);


//? LISTEN
app.listen(3000, () => {
  console.log("Server is Running ...");
});
