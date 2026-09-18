const mysql = require("mysql2");

// Build database configuration supporting both DATABASE_URL and individual parameters
let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = process.env.DATABASE_URL;
} else {
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shelfshare",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  };

  if (process.env.DB_SSL === "true") {
    poolConfig.ssl = {
      rejectUnauthorized: false,
    };
  }
}

const pool = mysql.createPool(poolConfig);

// Test connectivity on initial start
pool.getConnection((err, conn) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database Pool");
    conn.release();
  }
});

module.exports = pool;