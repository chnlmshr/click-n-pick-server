const Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  mongoose = require("mongoose");

module.exports = {
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
  dummyVendor: {
    role: "VENDOR",
    shopName: "test shop",
    username: "test name",
    password: "123456",
    phone: 12345567890,
    city: "test city",
    state: "test state",
    pincode: 123456,
  },
  dummyCustomer: {
    role: "CUSTOMER",
    name: "test name",
    password: "123456",
    phone: 12345567890,
    city: "test city",
    state: "test state",
    pincode: 123456,
  },
  initiateDB: (dbName) => {
    try {
      beforeEach(async () => {
        await mongoose.connect(
          `mongodb+srv://test:pick@cluster0.dvi1b.mongodb.net/${dbName}?retryWrites=true&w=majority`,
          {
            useUnifiedTopology: true,
            useNewUrlParser: true,
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
  },
  destroyDB: () => {
    try {
      afterEach(async () => {
        await Vendor.deleteMany();
        await Customer.deleteMany();
      });
    } catch (error) {
      console.log(error);
    }
  },
  destroyDBAfterAll: () => {
    try {
      afterAll(async () => {
        await Vendor.deleteMany();
        await Customer.deleteMany();
      });
    } catch (error) {
      console.log(error);
    }
  },
};
