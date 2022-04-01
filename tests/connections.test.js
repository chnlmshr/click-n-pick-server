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
    destroyDBAfterAll,
    CUSTOMER,
    VENDOR,
  } = require("./logistics");

initiateDB("connections");

let loginRes,
  vendor1,
  vendor2,
  customer,
  connection,
  loginRes2,
  getRes,
  getRes2,
  vendorLoginRes,
  customerLoginRes;

describe("Making Connections V2V", () => {
  it("lets a vendor follow another vendor", async () => {
    await request.post("/auth/signup").send(dummyVendor);

    vendorLoginRes = await request.post("/auth/login").send(dummyVendor);

    await request
      .post("/auth/signup")
      .send({ ...dummyVendor, username: "vendor2", phone: 9877889376 });

    vendor1 = await Vendor.findOne({ username: dummyVendor.username });
    vendor2 = await Vendor.findOne({ username: "vendor2" });

    connection = {
      following: {
        connectionName: vendor2.username,
        connectionId: vendor2._id.toString(),
      },
      followers: {
        connectionName: vendor1.username,
        connectionId: vendor1._id.toString(),
      },
    };

    await request
      .put("/connections/follow")
      .set("authorization", `${vendorLoginRes.body.data} ${VENDOR}`)
      .send(connection.following);

    loginRes2 = await request
      .post("/auth/login")
      .send({ ...dummyVendor, username: "vendor2", phone: 9877889376 });

    getRes = await request
      .get("/connections")
      .set("authorization", `${vendorLoginRes.body.data} ${VENDOR}`);
    getRes2 = await request
      .get("/connections")
      .set("authorization", `${loginRes2.body.data} ${VENDOR}`);

    expect(getRes.body.data).toStrictEqual({
      followers: [],
      following: [connection.following],
    });
    expect(getRes2.body.data).toStrictEqual({
      followers: [connection.followers],
      following: [],
    });
  });
});

describe("Making Connections C2V", () => {
  it("lets a customer follow vendor", async () => {
    await request.post("/auth/signup").send(dummyCustomer);

    customerLoginRes = await request.post("/auth/login").send(dummyCustomer);

    customer = await Customer.findOne({
      username: dummyCustomer.username,
    });

    connection = {
      ...connection,
      followers: [
        connection.followers,
        {
          connectionName: customer.name,
          connectionId: customer._id.toString(),
        },
      ],
    };

    await request
      .put("/connections/follow")
      .set("authorization", `${customerLoginRes.body.data} ${CUSTOMER}`)
      .send(connection.following);

    getRes = await request
      .get("/connections")
      .set("authorization", `${customerLoginRes.body.data} ${CUSTOMER}`);
    getRes2 = await request
      .get("/connections")
      .set("authorization", `${loginRes2.body.data} ${VENDOR}`);

    expect(getRes.body.data).toStrictEqual({
      following: [connection.following],
    });
    expect(getRes2.body.data).toStrictEqual({
      followers: connection.followers,
      following: [],
    });
  });
});

describe("Breaking Connections V2V", () => {
  it("lets a vendor follow another vendor", async () => {
    await request
      .put("/connections/unfollow")
      .set("authorization", `${vendorLoginRes.body.data} ${VENDOR}`)
      .send(connection.following);

    await request
      .put("/connections/unfollow")
      .set("authorization", `${customerLoginRes.body.data} ${CUSTOMER}`)
      .send(connection.following);

    getRes = await request
      .get("/connections")
      .set("authorization", `${vendorLoginRes.body.data} ${VENDOR}`);
    getRes3 = await request
      .get("/connections")
      .set("authorization", `${customerLoginRes.body.data} ${CUSTOMER}`);
    getRes2 = await request
      .get("/connections")
      .set("authorization", `${loginRes2.body.data} ${VENDOR}`);

    expect(getRes.body.data).toStrictEqual({
      followers: [],
      following: [],
    });
    expect(getRes2.body.data).toStrictEqual({
      followers: [],
      following: [],
    });
    expect(getRes3.body.data).toStrictEqual({
      following: [],
    });
  });
});

destroyDBAfterAll();
