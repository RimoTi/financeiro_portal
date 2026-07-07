/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useLocation,  useNavigate } from "react-router-dom";

/*import { Spinner } from "@components/spinner";*/
import { Representante } from "@features/cupom/types";
import { CButton } from "@coreui/react";

export const DetalhesCupom: React.FC = () => {

    const location = useLocation();
    const navigate = useNavigate()
    //const { id } = useParams<{ id: string }>();

    const [rep, setRepresentante] = useState<Representante | null>(
        location.state?.representante || null
    );

    // Função genérica para alternar o checkbox de um item específico
    const toggleItem = (id: number, tipo: 'creditos' | 'debitos') => {
        setRepresentante((prev: any) => ({
            ...prev,
            [tipo]: prev[tipo].map((item: any) =>
                item.id === id ? { ...item, checkado: !item.checkado } : item
            )
        }));
    };

    // Função para marcar/desmarcar todos de um tipo dentro de um representante
    const toggleTodos = (tipo: 'creditos' | 'debitos') => {
        setRepresentante((prev: any) => {
            // 1. Pega a lista atual (creditos ou debitos)
            const itens = prev[tipo];

            // 2. Verifica se existe pelo menos um item desmarcado
            // Se existir um 'false', algumDesmarcado será true (devemos marcar tudo)
            const algumDesmarcado = itens.some((item: any) => !item.checkado);

            // 3. Retorna o estado atualizado
            return {
                ...prev,
                [tipo]: itens.map((item: any) => ({
                    ...item,
                    checkado: algumDesmarcado
                }))
            };
        });
    };

    const formatMoney = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


    return rep && (
        <div style={styles.container}>
            <div style={styles.headerRow}>                
                <h2 style={styles.repTitle}>{rep.descRep} ({rep.codRep})</h2>
                <CButton style={styles.buttonVoltar} size="sm" onClick={() => navigate(-1)}>
                    ⬅️ Voltar
                </CButton>
            </div>
            <h3 style={styles.subTitle}>Créditos</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>
                            <input
                                type="checkbox"
                                // Verifica se todos estão marcados para o checkbox ficar preenchido
                                checked={rep.creditos.length > 0 && rep.creditos.every(c => c.checkado)}
                                onChange={() => toggleTodos('creditos')}
                            />
                        </th>
                        <th style={styles.th}>PDV</th>
                        <th style={styles.th}>Valor PDV</th>
                        <th style={styles.th}>Prêmio</th>
                    </tr>
                </thead>
                <tbody>
                    {rep.creditos.map((c: any) => (
                        <tr key={c.id}>
                            <td style={styles.td}><input type="checkbox" checked={!!c.checkado} onChange={() => toggleItem(c.id, 'creditos')} /></td>
                            <td style={styles.td}>{c.numPdvLoja}</td>
                            <td style={styles.td}>{formatMoney(c.vlrPdv)}</td>
                            <td style={styles.td}>{formatMoney(c.vlrPremioPdv)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3 style={styles.subTitle}>Débitos</h3>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>
                            <input
                                type="checkbox"
                                // Verifica se todos estão marcados para o checkbox ficar preenchido
                                checked={rep.debitos.length > 0 && rep.debitos.every(c => c.checkado)}
                                onChange={() => toggleTodos('debitos')}
                            />
                        </th>
                        <th style={styles.th}>Tipo</th>
                        <th style={styles.th}>Valor Pendente</th>
                        <th style={styles.th}>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {rep.debitos.map((d: any) => (
                        <tr key={d.id}>
                            <td style={styles.td}><input type="checkbox" checked={!!d.checkado} onChange={() => toggleItem(d.id, 'debitos')} /></td>
                            <td style={styles.td}>{d.tipoDeb}</td>
                            <td style={styles.td}>{formatMoney(d.vlrPend)}</td>
                            <td style={styles.td}>{new Date(d.dtPdv).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
             <div style={styles.buttonsArea}>
                <CButton color="primary" >Gerar</CButton>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    buttonsArea:{
        margin:"20px",
        display: "flex",         // Necessário para habilitar o alinhamento flex
        justifyContent: "flex-end"
    },
    buttonVoltar:{backgroundColor: "grey", width: "100px"},
    container: { padding: "24px", minHeight: "100vh" },
    headerRow: {
        display: "flex",
        alignItems: "center",         // Alinha verticalmente (centro)
        justifyContent: "space-between", // Empurra um para cada lado
        padding: "10px 0",            // Opcional: espaçamento vertical
        marginBottom: "20px",
        width: "100%"                 // Garante que o container ocupe a largura total
    },
    section: { marginBottom: "40px", backgroundColor: "#ffffff", padding: "20px", borderRadius: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" },
    repTitle: { fontSize: "20px", color: "#1e293b",  borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" },
    subTitle: { fontSize: "16px", color: "#64748b", marginTop: "20px", marginBottom: "10px" },
    table: { width: "100%", borderCollapse: "collapse", marginTop: "10px", backgroundColor: "#fff", borderRadius: "8px", overflow: "hidden" },
    th: { textAlign: "left", padding: "12px", backgroundColor: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: "14px", color: "#475569" },
    td: { padding: "12px", borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#1e293b" }
};