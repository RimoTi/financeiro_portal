import React, { useState } from "react";
import Papa, { ParseResult } from "papaparse";
import { importarCsv } from "../ecommerceService";
import { csvEcommerceImport } from "../types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@components/spinner";

type CsvRow = Record<string, string>;

export const ImportCsvEcommerce: React.FC = () => {
    const [data, setData] = useState<CsvRow[]>([]);
    const [fileName, setFileName] = useState("");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataBaixa, setDataBaixa] = useState(new Date());




    const validarEstruturaCsv = (data: CsvRow[]): boolean => {
        const colunasEsperadas = ["Nota Fiscal", "Parcela", "Total Parcelas", "Valor Liquido"];
        const colunasCsv = Object.keys(data[0] || {});
        const colunasFaltando = colunasEsperadas.filter(col => !colunasCsv.includes(col));

        if (colunasFaltando.length > 0) {
            toast.error(`Colunas faltando no CSV: ${colunasFaltando.join(", ")}`);
            return false;
        }
        return true;
    };

    const validaNotasDuplicadas = (data: CsvRow[]): boolean => {
        const notasSet = new Set<string>();

        for (const row of data) {
            const numNf = String(row["Nota Fiscal"] ?? "").trim();

            if (!numNf) continue; // ignora vazio

            if (notasSet.has(numNf)) {
                toast.error(`Nota fiscal duplicada: ${numNf}`);
                return false;
            }

            notasSet.add(numNf);
        }

        return true;
    };


    const handleFile = (file: File) => {
        try {
            setLoading(true);
            setFileName(file.name);

            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: ParseResult<CsvRow>) => {

                    const linhasValidas = results.data.filter((row) =>
                        Object.values(row).some((valor) =>
                            String(valor).trim() !== ""
                        )
                    );

                    const agrupado: Record<string, CsvRow> = {};

                    linhasValidas.forEach((row) => {
                        const nota = String(row["Nota Fiscal"]).trim();

                        if (!nota) return;

                        const valor = parseFloat(
                            String(row["Valor Liquido"])
                                .replace(/\./g, "")
                                .replace(",", ".")
                        ) || 0;

                        if (agrupado[nota]) {
                            const atual = parseCurrency(
                                agrupado[nota]["Valor Liquido"]
                            );

                            agrupado[nota]["Valor Liquido"] = (atual + valor).toFixed(2).replace(".", ",");
                        } else {
                            agrupado[nota] = {
                                ...row,
                                "Valor Liquido": (valor).toFixed(2).replace(".", ",")
                            };
                        }
                    });

                    setData(Object.values(agrupado));
                },
            });
        } catch (error) {
            console.error("Erro ao ler o arquivo:", error);
            toast.error("Erro ao ler o arquivo");
        } finally {
            setLoading(false);
        };
    };

    const sumValorLiquido = (data: CsvRow[]): number => {
        return data.reduce((total, row) => {
            const valor = parseCurrency(row["Valor Liquido"] ?? "0");
            return total + valor;
        }, 0);
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

    const parseCurrency = (value: string): number => {
        if (!value) return 0;

        return Number(
            value
                .replace(/\s/g, "")      // remove espaços
                .replace("R$", "")       // remove moeda
                .replace(/\./g, "")      // remove milhar
                .replace(",", ".")       // troca decimal
        );
    };

    const handleUpload = async () => {
        if (!validaNotasDuplicadas(data)) return;
        if (!validarEstruturaCsv(data)) return;
        try {

            const dtoArray = data.map<csvEcommerceImport>((row) => ({
                numNf: Number(row["Nota Fiscal"]),
                parcela: Number(row["Parcela"]),
                totalParcela: Number(row["Total Parcelas"]),
                valorLiquido: parseCurrency(row["Valor Liquido"]),
                data: dataBaixa
            }));

            console.log("Dados para importação:", dtoArray);
            try {
                setLoading(true);
                const response = await importarCsv(dtoArray);
                navigate("/consciliacao/retorno", {
                    state: response
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: string | any) {
                toast.error(error);
                return; // interrompe o processo se houver erro
                //console.log(msg); // ou toast
            } finally {
                setLoading(false);
            }

        } catch (error) {
            console.error(error);
            toast.error("Erro ao enviar dados");
        }
    };

    if (loading) {
        if (loading) return <Spinner text="Carregando dados..." fullScreen />;
    }

    return (
        <>
            <div style={styles.inputs}>
                <label htmlFor="dataBaixa">Data da Baixa:</label>
                <input style={styles.input} type="date" placeholder="Data da Baixa" value={dataBaixa.toISOString().split("T")[0]} onChange={(e) => setDataBaixa(new Date(e.target.value))} />
            </div>
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    {/* colocar inputs aqui */}
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

                    {fileName && <p style={styles.fileName}>Arquivo: {fileName}  -   Valor total: {sumValorLiquido(data).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>}

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
                                    {data.map((row, i) => (
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
        </>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    input: {
        width: "250px",
        padding: "10px",
        marginBottom: "10px",
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },
    inputs: {
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
    },
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