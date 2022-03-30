const supertest = require("supertest"),
  app = require("../index"),
  mongoose = require("mongoose"),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  request = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});
