const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const dns = require("dns").promises;

let memoryServer;

if (process.env.MONGO_DNS_SERVER) {
  dns.setServers(process.env.MONGO_DNS_SERVER.split(",").map((server) => server.trim()));
}

const connectDB = async () => {
  const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task-manager";

  try {
    await mongoose.connect(uri, {});
    console.log("MongoDB connected");
  } catch (err) {
    const shouldUseMemoryServer =
      process.env.NODE_ENV === "development" || !process.env.MONGO_URI;

    if (shouldUseMemoryServer) {
      console.warn("MongoDB not reachable, starting in-memory MongoDB server...");
      memoryServer = await MongoMemoryServer.create();
      process.env.MONGO_URI = memoryServer.getUri();
      await mongoose.connect(process.env.MONGO_URI, {});
      console.log("MongoDB connected via in-memory MongoDB server");
      return;
    }

    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
};

module.exports = connectDB;
