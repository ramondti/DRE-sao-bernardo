import knex from "../database/db";
export class FindAllDataService {
  async execute() {
    try {
      const getMes = await knex.raw(`
      SELECT DISTINCT dt_mes,dt_ano  
      FROM app_allstrategy.tbl_dti_financeiro
      WHERE TP_STATUS = 'A'
      `);

      if (!getMes || getMes.length === 0) {
        console.log(" ### Não existe lotes fechados");
        return {
          result: "ERROR",
          debug_msg: "Não encontrado registro no banco de dados",
        };
      }

      console.log(getMes[0].DT_MES);
      console.log(getMes[0].DT_ANO);

      const result = await knex.raw(`
  SELECT 
  dt_comp COMP,
  dt_mes MES,
  dt_ano ANO,
  dt_dia DATA,
  ds_lancamento DESC_CONTA,
  cd_lote || '.' || cd_lcto_contabil DOC,
  codigo_conta_contabil COD_CONTA,
  valor VALOR,
  ds_historico HIS,
  cd_cen_cus COD_CC,
  ds_cen_cus DESC_CC,
  sn_rateio RATEIO,
  codigo_unidade COD_UNID,
  'A' AS NATUREZA,
  cd_multi_empresa COD_EMPRESA
  FROM app_allstrategy.tbl_dti_financeiro
  WHERE TP_STATUS = 'A'
  and dt_mes = ${getMes[0].DT_MES}
  and dt_ano = ${getMes[0].DT_ANO}
  `);

      await knex.raw(`
  UPDATE app_allstrategy.tbl_dti_financeiro SET tp_status = 'T' where tp_status = 'A' and dt_mes = ${getMes[0].DT_MES} and dt_ano= ${getMes[0].DT_ANO}
  `);

      return result;
    } catch (error) {
      return console.log(error);
    }
  }
}
