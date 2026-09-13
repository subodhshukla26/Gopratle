const app = require("./app");
const connectDatabase = require("./config/database");
const { port } = require("./config/env");

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(port, () => {
      console.log(`GoPratle backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();