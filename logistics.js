module.exports = {
  roles: {
    VENDOR: "VENDOR",
    CUSTOMER: "CUSTOMER",
  },
  rejectRequestWith: (res, error) => res.send({ success: false, error: error }),
  respondWith: (res, data) => res.send({ success: true, data: data }),
};
