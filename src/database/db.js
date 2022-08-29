import knex from "knex";
import Oracle from "oracledb";

Oracle.initOracleClient({ libDir: process.env.ORACLE_DIR });

export default knex({
  client: "oracledb",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION,
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
