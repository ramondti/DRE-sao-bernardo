import axios from "axios";
import { FindAllDataService } from "../services/FindAllDataService";

export class FindDreService {
  async execute() {
    console.log(" ### Entrou no FindDreService");

    // Estão como SAMES e HEMO mas os dois enviam para a mesmo enpoint que é do SAO BERNARDO (SBS)
    const url_SAMES = process.env.API_SAMES;
    const url_HEMO = process.env.API_HEMO;

    const findAllDataService = new FindAllDataService();

    const allData = await findAllDataService.execute();

    console.log(allData.length);

    if (!allData || allData.length === 0) {
      console.log(" ### Não encontrado registro no banco de dados");
      return {
        result: "ERROR",
        debug_msg: "Não encontrado registro no banco de dados",
      };
    }

    const listSAMES = [];
    const listHEMO = [];

    let objectSAMES = {};
    let objectHEMO = {};

    const listObjectSAMES = [];

    for (let i = 0; i < allData.length; i++) {
      const element = allData[i];

      const data = {
        MES: element.MES,
        ANO: element.ANO,
        DATA: element.DATA,
        COD_UNIDADE: element.COD_UNID,
        COD_CC: element.COD_CC,
        DESC_CC: element.DESC_CC,
        COD_CONTA: element.COD_CONTA,
        DESC_CONTA: element.DESC_CONTA,
        DOCUMENTO: element.DOC,
        NATUREZA: element.NATUREZA,
        VALOR: element.VALOR,
        HISTORICO: element.HIS,
        COD_PROJETO: null,
        GERADOR: null,
        COD_DIMENSAO: null,
        RATEIO: element.RATEIO,
      };

      if (element.COD_EMPRESA === 1) {
        objectSAMES = {
          PAGINAS: 1,
          COMPETENCIA: allData[0].COMP,
          CARGA_ADICIONAL: 0,
          PAGINA: 1,
        };

        listSAMES.push(data);
      } else if (element.COD_EMPRESA === 7) {
        objectHEMO = {
          PAGINAS: 1,
          COMPETENCIA: allData[0].COMP,
          CARGA_ADICIONAL: 0,
          PAGINA: 1,
        };
        listHEMO.push(data);
      }
    }

    if (listSAMES.length > 0 && listSAMES.length <= 1000) {
      objectSAMES.IMPORTACAO = listSAMES;

      console.log(" ### ENVIANDO SAMES menor que mil", objectSAMES);
      await axios
        .post(url_SAMES, objectSAMES, {
          headers: {
            client_id: process.env.CLIENT_SAMES,
            "Content-Type": "application/json",
          },
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error.response));
    } else if (listSAMES.length > 1000) {
      let finalList = new Map();
      let milhar = 1;
      console.log(" ### SAMES PASSOU DE MIL");

      var list = [];
      let count = 0;

      for (let i = 0; i < listSAMES.length; i++) {
        if ((listSAMES.length / 1000).toPrecision(1) * 1000 < i) {
          console.log(" ### break", i);
          break;
        }

        if (i >= 1000) {
          if (i % 1000 == 0) {
            console.log(" ### entrou aqui ", i, i % 1000 == 0, i / 1000);

            console.log(
              " ### total de valores => ",
              list.length,
              milhar.toString()
            );
            finalList.set(milhar.toString(), list);

            milhar += 1;
            list = [];
          }
        }
        list.push(listSAMES[i]);

        count = i + 1;
      }
      console.log(count);
      for (let i = count; i < listSAMES.length; i++) {
        list.push(listSAMES[count]);
      }

      finalList.set(milhar.toString(), list);
      console.log(milhar);

      console.log(finalList.size);

      let CARGA = 0;

      for (let i = 0; i < finalList.size; i++) {
        const elements = finalList.get((i + 1).toString());

        objectSAMES.PAGINAS = finalList.size;
        objectSAMES.CARGA_ADICIONAL = CARGA;
        objectSAMES.PAGINA = i + 1;
        objectSAMES.IMPORTACAO = elements;
        console.log(
          " ### ENVIANDO SAMES",
          objectSAMES.PAGINAS,
          objectSAMES.PAGINA,
          elements.length
        );

        console.log(" ### ENVIANDO SAMES / CARGA", CARGA);

        if (CARGA === 0) {
          CARGA = CARGA + 1;
        }

        await axios
          .post(url_SAMES, objectSAMES, {
            headers: {
              client_id: process.env.CLIENT_SAMES,
              "Content-Type": "application/json",
            },
          })
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error.response.data));
        listObjectSAMES.push(objectSAMES);
      }
    }

    if (listHEMO > 0 && listHEMO.length <= 1000) {
      objectHEMO.IMPORTACAO = listHEMO;

      console.log(" ### ENVIANDO HEMO menor que mil", objectHEMO);
      await axios
        .post(url_HEMO, objectHEMO, {
          headers: {
            client_id: process.env.CLIENT_HEMO,
            "Content-Type": "application/json",
          },
        })
        .then((response) => console.log(response.data))
        .catch((error) => console.log(error.response));
    } else if (listHEMO.length > 1000) {
      console.log(" ### HEMO PASSOU DE MIL");
      let count = 0;
      let finalList = [];
      let milhar = 1;

      while (count !== listHEMO.length) {
        if (count !== 0 && count % 1000 == 0) {
          milhar = count / 1000;
        }

        finalList[milhar].push(listHEMO[count]);
        count += 1;
      }

      for (let i = 0; i < finalList.length; i++) {
        const elements = finalList[i];

        objectHEMO.PAGINAS = finalList.length;
        objectHEMO.CARGA_ADICIONAL = 1;
        objectHEMO.PAGINA = i + 1;
        objectHEMO.IMPORTACAO = elements;

        console.log(" ### ENVIANDO HEMO", objectHEMO);

        await axios
          .post(url_HEMO, objectHEMO, {
            headers: {
              client_id: process.env.CLIENT_HEMO,
              "Content-Type": "application/json",
            },
          })
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error.response));
      }
    }

    return listObjectSAMES;
  }
}
