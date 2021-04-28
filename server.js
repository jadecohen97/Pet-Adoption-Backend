const express = require("express");
const cors = require("cors");
const path = require("path");
// const { dirname } = require("path");
const { postgrator } = require("./lib/database");
// const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// const uploadedFilesFolderName = "public";
// exports.uploadedFilesFolderName = uploadedFilesFolderName;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./" + uploadedFilesFolderName);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

// // const upload = multer({
// //   storage,
// //   limits: { fileSize: 5 * 1024 * 1024 * 1024 },
// // });
// // exports.upload = upload;

// app.use("/" + uploadedFilesFolderName, express.static(uploadedFilesFolderName));

// // const router = require("./access");
// const upload = multer({ storage });

// app.post("/addPet", upload.single("my_file"), async (req, res) => {
//   res.send("upload success");
// });

app.use("/signup", require("./routes/access"));
app.use("/login", require("./routes/access"));
app.use("/pets", require("./routes/addPet"));


// app.get("/:id", async (req, res) => {
//   console.log("appjs: ", req.params.id);
// });

const port = "8050";
const host = "0.0.0.0";

postgrator
  .migrate()
  .then((result) => {
    console.log(`migrated db:`, result);
    app.listen(port, host, () => {
      console.log(`The server is listening at http://${host}:${port}`);
    });
  })
  .catch((error) => console.error(error));
