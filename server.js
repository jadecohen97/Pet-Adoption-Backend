const express = require("express");
const cors = require("cors");
const path = require("path");
const { postgrator } = require("./lib/database");
const { uploadedFilesFolderName } = require("./middlewares/multipart");

const app = express();
app.use(express.json());
app.use(cors());
app.use("/signup", require("./routes/access"));
app.use("/login", require("./routes/access"));
app.use("/pets", require("./routes/addPet"));

app.use("/" + uploadedFilesFolderName, express.static(uploadedFilesFolderName));

const port = "8050";
const host = "0.0.0.0";

postgrator
  .migrate()
  .then((result) => {
    app.listen(port, host, () => {
      console.log(`The server is listening at http://${host}:${port}`);
    });
  })
  .catch((error) => console.error(error));
