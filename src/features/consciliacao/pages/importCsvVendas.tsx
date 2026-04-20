import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@components/spinner";
import { mapCsvToDto } from "../consciliacaoService";
import { Pagamento } from "../types";
import { CTooltip } from "@coreui/react";

type CsvRow = Record<string, string>;

export const ImportCsvVendas: React.FC = () => {
  const [data, setData] = useState<CsvRow[]>([]);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const handleFile = (file: File) => {
    try {
      setLoading(true);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: ParseResult<CsvRow>) => {
          setData(results.data);
        },
      });
    } catch (error) {
      console.error("Erro ao ler o arquivo:", error);
      toast.error("Erro ao ler o arquivo");
    } finally {
      setLoading(false);
    };
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


  const removerDuplicadas = (dados: Pagamento[]) => {
    const map = new Map<string, Pagamento>();

    dados.forEach(item => {
      const existente = map.get(item.numAutorizacao);

      if (!existente || item.parcela > existente.parcela) {
        map.set(item.numAutorizacao, item);
      }
    });

    return Array.from(map.values());
  };


  const handleUpload = async () => {
    const dados = mapCsvToDto(data);
    const pagamentos = removerDuplicadas(dados);

    navigate("/consciliacao/semVinculo", {
      state: { pagamentos }
    }); // Redireciona para a página de lista após a importação

  };

  if (loading) {
    if (loading) return <Spinner text="Carregando dados..." fullScreen />;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Importar CSV Vendas Realizadas</h2>

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
        <CTooltip content="Importa os dados do CSV" placement="top">
          <button style={styles.fab} onClick={handleUpload}>
            ⬆ Importar
          </button>
        </CTooltip>
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