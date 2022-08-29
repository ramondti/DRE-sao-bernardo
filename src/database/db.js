import "dotenv/config";
import knex from "knex";
import Oracle from "oracledb";

Oracle.initOracleClient({ libDir: process.env.ORACLE_DIR });

export default knex({
  client: "oracledb",
  connection: {
    user: "APP_ALLSTRATEGY",
    password: "mUnMhbjrYFCw",
    connectString:
      "(DESCRIPTION=(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.240.1)(PORT = 1521)))(CONNECT_DATA = (SERVER = DEDICATED) (SID = mv2000)))",
    pool: {
      min: 1,
      max: 3,
    },
  },
});
