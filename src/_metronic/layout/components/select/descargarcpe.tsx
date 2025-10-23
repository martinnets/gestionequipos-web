import React from "react";
import { Button } from "react-bootstrap"; // Metronic usa bootstrap internamente
interface Props {
  token?: string;
  numNifEmis: string;
  codTipCPE: string;
  numSerieCPE: string;
  numCorreCPE: string;
  fecEmisCPE: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
  className?: string;
  buttonText?: string;
}
const DescargarCPEPDF: React.FC<Props> = ({
  token = "72KFZ1MiPt26dkooMaHrWg==",
  numNifEmis,
  codTipCPE,
  numSerieCPE,
  numCorreCPE,
  fecEmisCPE,
  onSuccess,
  onError,
  className = "",
  buttonText = "Descargar Comprobantre en PDF"
}) => {
  const handleDownload = async () => {
    const url = "https://mifact.net.pe/mifactapi39/invoiceService.svc/GetInvoice";

    const payload = {
      TOKEN: token,
      NUM_NIF_EMIS: numNifEmis,
      COD_TIP_CPE: codTipCPE,
      NUM_SERIE_CPE: numSerieCPE,
      NUM_CORRE_CPE: numCorreCPE,
      FEC_EMIS: fecEmisCPE,
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
        link.download = 'CPE-F001-'+ numCorreCPE +'.pdf';
        link.click();
        URL.revokeObjectURL(link.href);

       // alert("✅ PDF descargado con éxito");
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
    <div className="d-flex justify-content-center mt-5">
      <Button variant="primary" onClick={handleDownload}>
        <i className="bi bi-file-earmark-pdf me-2"></i> Descargar CPE en PDF
      </Button>
    </div>
  );
};

export default DescargarCPEPDF;
