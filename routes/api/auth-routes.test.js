const mongoose = require("mongoose");
const app = require("../../app.js");
const request = require("supertest");
const dotenv = require("dotenv");
dotenv.config();
const { User } = require("../../models/User.js");
const { DB_TEST_HOST, PORT } = process.env;

describe("test /api/login router", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test login correct data", async () => {
    const loginData = {
      email: "test3@com",
      password: "123456",
    };
    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    expect(statusCode).toBe(200);

    const user = await User.findOne({ email: loginData.email });

    expect(loginData.email).toBe(user.email);
    expect(typeof user.token).toBe("string");
    expect(typeof user.subscription).toBe("string");
  });
});
