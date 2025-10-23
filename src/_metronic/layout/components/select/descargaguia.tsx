import React from "react";
import { Button } from "react-bootstrap"; // Metronic usa bootstrap internamente
interface Props {
  token?: string;
  numNifEmis: string;
  codTipGur: string;
  numSerieGur: string;
  numCorreGur: string;
  fecEmisGur: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  className?: string;
  buttonText?: string;
}
const DescargarGuiaPDF: React.FC<Props> = ({
  token = "72KFZ1MiPt26dkooMaHrWg==",
  numNifEmis,
  codTipGur,
  numSerieGur,
  numCorreGur,
  fecEmisGur,
  onSuccess,
  onError,
  className = "",
  buttonText = "Descargar Guía en PDF"
}) => {
  const handleDownload = async () => {
    //const url = "https://demo.mifact.net.pe/api/GuiaRemision.svc/GetGuia";
    const url ="https://mifact.net.pe/mifactapi39/GuiaRemision.svc/GetGuia";
    const payload = {
      TOKEN: token,
      NUM_NIF_EMIS: numNifEmis,
      COD_TIP_GUR: codTipGur,
      NUM_SERIE_GUR: numSerieGur,
      NUM_CORRE_GUR: numCorreGur,
      FEC_EMIS_GUR: fecEmisGur,
      RETORNA_XML_ENVIO: "false",
      RETORNA_XML_CDR: "false",
      RETORNA_PDF: "true",
    };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Respuesta completa:", data);
      if (data.pdf_bytes) {
        // Decodificar Base64
        const byteChars = atob(data.pdf_bytes);
        const byteNumbers = new Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          byteNumbers[i] = byteChars.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });

        // Crear link y forzar descarga
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'Guia-T001-'+ numCorreGur +'.pdf';
        link.click();
        URL.revokeObjectURL(link.href);

        //alert("✅ PDF descargado con éxito");
      } else {
        console.error("⚠️ Error en respuesta:", data);
        //alert("No se recibió PDF. Revisa los parámetros o el TOKEN.");
      }
    } catch (error) {
      console.error("❌ Error en la llamada:", error);
      //alert("Error al conectar con el servicio");
    }
  };

  return (
    <div >
      <button className="btn btn-primary"  onClick={handleDownload}>
        <i className="bi bi-file-earmark-pdf me-2"></i> Descargar Guía en PDF
      </button>
    </div>
  );
};

export default DescargarGuiaPDF;
