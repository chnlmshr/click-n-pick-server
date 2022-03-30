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

describe("/signup", () => {
  it("signup successfull", async () => {
    const res = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop",
      username: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const vendor = await Vendor.findOne({ phone: 12345567890 });
    expect(res.body.success).toBe(true);
    expect(vendor.username).toBe("test name");
    expect(vendor.shopName).toBe("test shop");
    expect(vendor.password).toBeTruthy();
    expect(vendor.location.city).toBe("test city");
    expect(vendor.location.state).toBe("test state");
    expect(vendor.location.pincode).toBe(123456);
  });

  it("disallow duplicates", async () => {
    const res = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop",
      username: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const res2 = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop2",
      username: "test name",
      password: "123456",
      phone: 12345567891,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const res3 = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop3",
      username: "test name2",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    expect(res.body.success).toBe(true);
    expect(res2.body.success).toBe(false);
    expect(res2.body.success).toBe(false);
  });
});

describe("/signup", () => {
  it("signup successfull", async () => {
    const res = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop",
      username: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const vendor = await Vendor.findOne({ phone: 12345567890 });
    expect(res.body.success).toBe(true);
    expect(vendor.username).toBe("test name");
    expect(vendor.shopName).toBe("test shop");
    expect(vendor.password).toBeTruthy();
    expect(vendor.location.city).toBe("test city");
    expect(vendor.location.state).toBe("test state");
    expect(vendor.location.pincode).toBe(123456);
  });

  it("disallow duplicates", async () => {
    const res = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop",
      username: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const res2 = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop2",
      username: "test name",
      password: "123456",
      phone: 12345567891,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const res3 = await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop3",
      username: "test name2",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    expect(res.body.success).toBe(true);
    expect(res2.body.success).toBe(false);
    expect(res2.body.success).toBe(false);
  });
});

afterEach(async () => {
  await Vendor.deleteMany();
  await Customer.deleteMany();
});
