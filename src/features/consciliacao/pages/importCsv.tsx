import React, { useEffect, useState } from "react";
import Papa, { ParseResult } from "papaparse";
import {  validarCsv, getAllSisPag, mapCsvToDto, importarCsv } from "../consciliacaoService";
import { CsvSisPag, Coluna, validarCsv as validarCsvType } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type CsvRow = Record<string, string>;

export const ImportCsv: React.FC = () => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [sistPagId, setSistPagId] = useState(1); // Exemplo fixo, ajustar conforme necessário
  const [sistemasPagamento, setSistemasPagamento] = useState<CsvSisPag[]>([]);
const navigate = useNavigate();
useEffect(() => {
  const carregar = async () => {
    try {
      const response = await getAllSisPag();
      //console.log("Sistemas de Pagamento:", response);
      setSistemasPagamento(response);
    } catch (error) {
      console.error("Erro ao buscar sistemas de pagamento:", error);
    }
  };
  carregar(); 
}, []);

  const handleFile = (file: File) => {
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<CsvRow>) => {
        setData(results.data);
      },
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    try {

      const colunas: Coluna[] = Object.keys(data[0])
        .sort((a, b) => Number(a.replace("_", "")) - Number(b.replace("_", "")))
        .map((key, index) => ({
          nomeColunaCsv: key,
          posicaoColuna: index + 1,
        }));
      const requestData: validarCsvType = {
        sistPagId: sistPagId, 
        colunas,
      };

      try {
        const response = await validarCsv(requestData);
        toast.success(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const msg = error.response?.data?.message;
        toast.error(msg);
        return; // interrompe o processo se houver erro
        //console.log(msg); // ou toast
      }
      const novoArray = data.slice(1);
      const dtoArray = mapCsvToDto(novoArray, sistPagId);
      //console.log("Dados para importação:", dtoArray);
      try {
        const response = await importarCsv(dtoArray);
        toast.success(response);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const msg = error.response?.data?.message;
        toast.error(msg);
        return; // interrompe o processo se houver erro
        //console.log(msg); // ou toast
      }
      navigate("/home"); // Redireciona para a página de lista após a importação
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar dados");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h5>Sistema de Pagamento</h5>
        <select style={styles.select} name="" id="" onChange={(e) => setSistPagId(Number(e.target.value))}>
          {sistemasPagamento.map((sis) => (
            <option key={sis.id} value={sis.id}>
             {sis.sistPag}
            </option>
          ))}
        </select>
        <h2 style={styles.title}>Importar CSV</h2>

        <div
          style={styles.dropzone}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <p style={styles.text}>Arraste o arquivo ou clique abaixo</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            style={styles.inputFile}
          />
        </div>

        {fileName && <p style={styles.fileName}>Arquivo: {fileName}</p>}

        {data.length > 0 && (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(data[0]).map((col) => (
                    <th key={col} style={styles.th}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 10).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val: string, j) => (
                      <td key={j} style={styles.td}>{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {data.length > 0 && (
        <button style={styles.fab} onClick={handleUpload}>
          ⬆ Importar
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
  },
  fab: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "#164a75",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "15px 20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    zIndex: 999,
  },
  container: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#164a75",
  },
  dropzone: {
    border: "2px dashed #94a3b8",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    cursor: "pointer",
  },
  text: {
    marginBottom: "10px",
    color: "#475569",
  },
  inputFile: {
    cursor: "pointer",
  },
  fileName: {
    marginTop: "10px",
    color: "#164a75",
    fontWeight: "600",
  },
  tableContainer: {
    marginTop: "20px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#164a75",
    color: "#ffffff",
    padding: "10px",
    fontSize: "14px",
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
  },
    select: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "#fff",
    cursor: "pointer",
    minWidth: "200px",
    appearance: "none" as const,
  },
};