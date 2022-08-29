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
  },
});
