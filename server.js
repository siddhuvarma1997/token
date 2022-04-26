process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require("express");
// const cors = require("cors");
const app = express();

// const corsOption = {
//   origin: "http://localhost:8081",
// };

// app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const db = require("./models");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// db.sequelize.sync();
db.sequelize.sync();
// db.sequelize.sync({
//   force: true,
// });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
require("./routes/orders.routes")(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port${PORT}.`);
});
