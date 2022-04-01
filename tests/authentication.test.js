const supertest = require("supertest"),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  app = require("../index"),
  request = supertest(app),
  {
    initiateDB,
    destroyDB,
    dummyVendor,
    dummyCustomer,
  } = require("./logistics");

initiateDB("authentication");

describe("Signing Up", () => {
  it("disallow erroronous ROLES", async () => {
    const res = await request
      .post("/auth/signup")
      .send({ ...dummyCustomer, role: "RANDOM" });

    expect(res.body.success).toBe(false);
  });

  it("signs up vendor", async () => {
    const res = await request.post("/auth/signup").send(dummyVendor);

    const vendor = await Vendor.findOne({ phone: dummyVendor.phone }).select(
      "username -_id"
    );

    expect(res.body.success).toBe(true);
    expect(vendor.username).toBe(dummyVendor.username);
  });

  it("disallows duplicate vendors", async () => {
    const res = await request.post("/auth/signup").send(dummyVendor),
      res2 = await request
        .post("/auth/signup")
        .send({ ...dummyVendor, phone: 1234567892 }),
      res3 = await request
        .post("/auth/signup")
        .send({ ...dummyVendor, username: "test name 2" });

    expect(res.body.success).toBe(true);
    expect(res2.body.success).toBe(false);
    expect(res3.body.success).toBe(false);
  });

  it("signs up customer", async () => {
    const res = await request.post("/auth/signup").send(dummyCustomer);

    const customer = await Customer.findOne({
      phone: dummyCustomer.phone,
    }).select("name -_id");

    expect(res.body.success).toBe(true);
    expect(customer.name).toBe(dummyCustomer.name);
  });

  it("disallow duplicate cutomers", async () => {
    const res = await request.post("/auth/signup").send(dummyCustomer),
      res2 = await request.post("/auth/signup").send(dummyCustomer);

    expect(res.body.success).toBe(true);
    expect(res2.body.success).toBe(false);
  });
});

describe("Logging In", () => {
  it("logs in vendor", async () => {
    await request.post("/auth/signup").send(dummyVendor);

    const res = await request.post("/auth/login").send(dummyVendor);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeTruthy();
  });

  it("logs in customer", async () => {
    await request.post("/auth/signup").send(dummyCustomer);

    const res = await request.post("/auth/login").send(dummyCustomer);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeTruthy();
  });
});

destroyDB();
