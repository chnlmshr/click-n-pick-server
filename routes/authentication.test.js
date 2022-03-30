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
  it("vendor signup successfull", async () => {
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

  it("customer signup successfull", async () => {
    const res = await request.post("/auth/signup").send({
      role: "CUSTOMER",
      name: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const cutomer = await Customer.findOne({ phone: 12345567890 });
    expect(res.body.success).toBe(true);
    expect(cutomer.name).toBe("test name");
    expect(cutomer.password).toBeTruthy();
    expect(cutomer.location.city).toBe("test city");
    expect(cutomer.location.state).toBe("test state");
    expect(cutomer.location.pincode).toBe(123456);
  });

  it("disallow duplicate vendors", async () => {
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
    expect(res3.body.success).toBe(false);
    await Vendor.deleteMany();
    await Customer.deleteMany();
  });

  it("disallow duplicate cutomers", async () => {
    const res = await request.post("/auth/signup").send({
      role: "CUSTOMER",
      name: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    const res2 = await request.post("/auth/signup").send({
      role: "CUSTOMER",
      name: "test name2",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    expect(res.body.success).toBe(true);
    expect(res2.body.success).toBe(false);
    await Vendor.deleteMany();
    await Customer.deleteMany();
  });
});

describe("/login", () => {
  it("vendor login successfull", async () => {
    // seeding
    await request.post("/auth/signup").send({
      role: "VENDOR",
      shopName: "test shop",
      username: "test name",
      password: "123456",
      phone: 12345567890,
      city: "test city",
      state: "test state",
      pincode: 123456,
    });

    // login
    const res = await request.post("/auth/login").send({
      role: "VENDOR",
      phone: 12345567890,
      password: "123456",
    });

    console.log(res.body);
    expect(res.body.success).toBe(true);
    // const vendor = await Vendor.findOne({ phone: 12345567890 });
    // expect(res.body.success).toBe(true);
    // expect(vendor.username).toBe("test name");
    // expect(vendor.shopName).toBe("test shop");
    // expect(vendor.password).toBeTruthy();
    // expect(vendor.location.city).toBe("test city");
    // expect(vendor.location.state).toBe("test state");
    // expect(vendor.location.pincode).toBe(123456);
  });
});
