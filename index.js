const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB is up"))
  .catch((err) => console.log(err));

app.use("/auth", require("./routes/authentication"));
app.use("/post", require("./routes/post"));

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on ${process.env.PORT || 3001}`);
});
