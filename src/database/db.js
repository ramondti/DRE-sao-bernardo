import knex from "knex";
import Oracle from "oracledb";

Oracle.initOracleClient({ libDir: process.env.ORACLE_DIR });

export default knex({
  client: "oracledb",
  connection: {
    host: "192.168.240.1",
    port: 1521,
    user: "APP_ALLSTRATEGY",
    password: "mUnMhbjrYFCw",
    database: "mv2000",
    pool: {
      min: 2,
      max: 6,
      createTimeoutMillis: 3000,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
      propagateCreateError: false, // <- default is true, set to false
    },
  },
});
