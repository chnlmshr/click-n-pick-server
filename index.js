const authorize = require("./authorize");
const { rejectRequestWith, respondWith } = require("./logistics");

const express = require("express"),
  mongoose = require("mongoose"),
  cors = require("cors"),
  app = express(),
  { generateUploadURL } = require("./s3");

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

app.get("/", (req, res) =>
  res.send(
    "Welcome to Click and Pick API 👋.\n Visit https://chnlmshr.github.io/click-n-pick-landing/ to know more 🤗"
  )
);

app.get("/s3Url", authorize, async (req, res) => {
  try {
    const url = await generateUploadURL();
    respondWith(res, url);
  } catch (error) {
    rejectRequestWith(res, error.toString());
  }
});

app.use("/auth", require("./routes/authentication"));
app.use("/connections", require("./routes/connections"));
app.use("/post", require("./routes/post"));
app.use("/market", require("./routes/market"));
app.use("/notification", require("./routes/notification"));
app.use("/search", require("./routes/search"));

app.use((req, res) => res.send("Sorry! This Route doesn't exist 😔"));

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on ${process.env.PORT || 3001}`);
  });
}

module.exports = app;
