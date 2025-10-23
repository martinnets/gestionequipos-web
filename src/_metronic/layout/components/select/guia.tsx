import React from "react";
import { Button } from "react-bootstrap";

interface Cabecera {
  INDICADOR_M1_L: number;
  INDICADOR_TRASLADO_TOTAL_DAM_DS: number;
  NRO_LICENCIA_CONDUCT: string;
  NRO_REGISTRO_MTC: string;
  PESO_TRASLADADO_PARCIAL_DAM_DS: string;
  NUM_NIF_LLEGADA_PARTIDA: string;
  TXT_VERS_UBL: string;
  TXT_VERS_ESTRUCT_UBL: string;
  TOKEN: string;
  RETORNA_XML_ENVIO: boolean;
  RETORNA_XML_CDR: boolean;
  RETORNA_PDF: boolean;
  OBSERVACIONES: string;
  COD_TIP_NIF_EMIS: string;
  NUM_NIF_EMIS: string;
  NOM_COMER_EMIS: string;
  TXT_DMCL_FISC_EMIS: string;
  NOM_RZN_SOC_EMIS: string;
  COD_UBI_EMIS: string;
  COD_TIP_GUR: string;
  NUM_SERIE_GUR: string;
  NUM_CORRE_GUR: string;
  ENVIAR_A_SUNAT: boolean;
  COD_PRCD_CARGA: string;
  FEC_EMIS_GUR: string;
  COD_TIP_NIF_DEST: string;
  NUM_NIF_DEST: string;
  DIR_LLEGADA: string;
  UBI_LLEGADA: string;
  NOM_RZN_SOC_DEST: string;
  MOT_TRASLADO: string;
  TXT_MOT_TRASLADO: string;
  IND_TRANSBORDO: boolean;
  MOD_TRASLADO: string;
  FEC_TRASLADO: string;
  NUM_NIF_CONDUCT: string;
  COD_TIP_NIF_CONDUCT: string;
  NOM_RZN_SOC_CONDUCT: string;
  PLACA: string;
  NRO_BULTOS: string;
  COD_TIP_NIF_TRANSP: string;
  NRO_CONTENEDOR: string;
  DIR_PARTIDA: string;
  UBI_PARTIDA: string;
  UND_MEDIDA: string;
  PESO_BRUTO: string;
}

interface Item {
  CANT_ITEM: number;
  COD_ITEM: string;
  DESC_ITEM: string;
  PESO_ITEM: number;
  COD_UND_MEDIDA_ITEM: string;
  NUM_LINEA: number;
}

interface Props {
  cabecera: Cabecera;
  items: Item[];
  docs_referenciado?: any[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const GenerarGuiaRemision: React.FC<Props> = ({
  cabecera,
  items,
  docs_referenciado = [],
  onSuccess,
  onError,
}) => {
  const handleGenerar = async () => {
    const url = "https://demo.mifact.net.pe/api/GuiaRemision.svc/SendGuia";

    // 🔹 Armar payload con cabecera + items + docs_referenciado
    const payload = {
      ...cabecera,
      items,
      docs_referenciado,
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.PDF) {
        // Decodificar Base64
        const byteChars = atob(data.PDF);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Descargar PDF
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "guia_remision.pdf";
        link.click();
        URL.revokeObjectURL(link.href);

        if (onSuccess) onSuccess();
      } else {
        if (onError) onError(data);
      }
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <Button variant="primary" onClick={handleGenerar}>
      <i className="bi bi-truck me-2"></i> Generar Guía y Descargar PDF
    </Button>
  );
};

export default GenerarGuiaRemision;
