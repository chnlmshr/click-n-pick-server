const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("DB is Up!"))
    .catch((err) => console.log(err));
}

app.use("/auth", require("./routes/authentication"));
app.use("/connections", require("./routes/connections"));
app.use("/post", require("./routes/post"));
app.use("/market", require("./routes/market"));

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on ${process.env.PORT || 3001}`);
  });
}

module.exports = app;
