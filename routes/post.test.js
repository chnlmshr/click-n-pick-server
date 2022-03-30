const supertest = require("supertest"),
  app = require("../index"),
  mongoose = require("mongoose"),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post"),
  request = supertest(app);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});

describe("/post", () => {
  it("post created", async () => {
    const res = await request
      .post("/post/create")
      .set(
        "Authentication",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjQ0M2NlNzUzOWMzNDliMjNhOGY3MWYiLCJpYXQiOjE2NDg2MzkyMDd9.xsx2LJ0ep9xSnxpeKpDmd91JI6kSwW54y1a7wZxO05A 12345567890"
      )
      .send({
        description: "Some description",
        productName: "Lays green",
        vendor: "624439cb858812fea44fa104",
        price: "100 rupay",
        availabilty: "10",
        images:
          "https://drive.google.com/uc?id=1HrmaZIAmH5ybI1J1QHyjlFVr6kyKmJff",
      });
      
  });
});
