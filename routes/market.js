const authorizeVendor = require("../authorize/vendor"),
  authorizeCustomer = require("../authorize/customer"),
  router = require("express").Router(),
  Vendor = require("../models/Vendor"),
  Customer = require("../models/Customer"),
  Post = require("../models/Post");
