
import { CButton, CFormInput, CFormLabel, CNav, CNavItem, CNavLink, CTabContent, CTabPane } from "@coreui/react";
import React, { CSSProperties, useState } from "react";

import { Abatimento, MovimentoBaixa, SaldoRepresentante } from "../types";
import { toast } from "react-toastify";
import { baixarCupons, getAbatimentos, getListaRepresentantes } from "../cupom_service";
import { Spinner } from "@components/spinner";

export const AbaterSaldo: React.FC = () => {
    const [activeKey, setActiveKey] = useState(1);
    const [abatimentos, setAbatimentos] = useState<Abatimento[]>([]);
    const [pedidosFilter, setPedidosFilter] = useState<string>("")
    const [codRep, setCodRep] = useState<string>("")
    const [repSaldo, setRepSaldo] = useState<SaldoRepresentante|null>(null)
    const [vlrPix, setVlrPix] = useState<string>("")
    const [observacao, setObservacao] = useState<string>("")
    const [loading, setLoading] = useState(false)

    const parsePedidos = (input: string): number[] =>
        input.split(",")
            .map(item => Number(item.trim()))
            .filter(item => !isNaN(item) && item !== 0);

    const getPedidosAbatimento = async () => {
        const pedidosArray = parsePedidos(pedidosFilter);
        if (pedidosArray.length === 0) {
            toast.error("Informe pedidos válidos para consulta");
            return;
        }

        try {
            setLoading(true);
            const data = await getAbatimentos(pedidosArray);
            setAbatimentos(data);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao buscar dados");
        } finally {
            setLoading(false);
        }
    };

    const registrarBaixas = async (repId: number) => {

        const confirmado = window.confirm("Você tem certeza que deseja baixar os pedidos?");

        if (!confirmado) {
            return; // Interrompe a execução se o usuário clicar em Cancelar
        }
        const pedidosArray = abatimentos.find(x => x.representante.id == repId)?.pedidos.map(p => p.numPedido) ?? [];;
        try {
            setLoading(true);
            const data: MovimentoBaixa = {
                numerosPedidos: pedidosArray,
                observacao: "",
                baixaAvulsa: null
            };
            const response = await baixarCupons(data);
            toast.success(response);
            setAbatimentos(abatimentos.filter(a => a.representante.id != repId))
            console.log(data)
            window.dispatchEvent(new CustomEvent("atualizarSidebar"));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao registrar baixa");
        } finally {
            setLoading(false);
        }
    };

    const registrarBaixasPix = async () => {

        const confirmado = window.confirm("Você tem certeza que deseja fazer essa baixa");

        if (!confirmado) {
            return; // Interrompe a execução se o usuário clicar em Cancelar
        }
        if(!vlrPix){
            toast.warning("Informe o valor o Pix");
            return;
        }

        try {
            setLoading(true);
            const saldo = Number(repSaldo?.saldo) || 0;
            const valorInformado = Number(vlrPix.replace(',', '.')) || 0;

            const diferenca = saldo - valorInformado;
            const valorFinal = diferenca < 1 && diferenca > -1 ? saldo : valorInformado;
            const data: MovimentoBaixa = {
                numerosPedidos: [],
                observacao: observacao,
                baixaAvulsa: {
                    codRep: repSaldo?.representante.codRep || "",
                    valor: valorFinal
                }
            };
            console.log(data)
            const response = await baixarCupons(data);
            toast.success(response);
            
            window.dispatchEvent(new CustomEvent("atualizarSidebar"));
            setRepSaldo(null)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao registrar baixa");
        } finally {
            setLoading(false);
        }
    };

    const getSaldoRep = async () => {
        if (!codRep) return;
        try {
            setLoading(true);
            const response = await getListaRepresentantes();
            const rep = response.find(s => s.representante.codRep == codRep);
            if (rep) {
                setRepSaldo(rep);
            } else {
                toast.warn("Representante sem saldo de cupom para abater.");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao registrar baixa");
        } finally {
            setLoading(false);
        }
    }

    const formatMoney = (val: number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    if (loading) return <Spinner text="Carregando Lançamentos..." />;

    return (
        <div style={styles.pageContainer}>
            <div style={styles.card}>
                <CNav variant="tabs" role="tablist" className="mb-4">
                    <CNavItem>
                        <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)} style={{ cursor: 'pointer' }}>
                            💰 Baixa por Pix
                        </CNavLink>
                    </CNavItem>
                    <CNavItem>
                        <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)} style={{ cursor: 'pointer' }}>
                            📦 Baixa de Pedidos
                        </CNavLink>
                    </CNavItem>
                </CNav>

                <CTabContent>
                    {/* ABA 1: PIX */}
                    <CTabPane visible={activeKey === 1}>
                        <div style={{ marginBottom: "20px" }}>
                            <CFormLabel>Código Representante</CFormLabel>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <CFormInput value={codRep} onChange={(e) => setCodRep(e.target.value)} placeholder="Ex: 123" />
                                <CButton onClick={getSaldoRep} color="primary">Buscar</CButton>
                            </div>
                        </div>

                        {repSaldo && (
                            <div style={styles.infoBox}>
                                <h5>Saldo Disponível: <strong>{formatMoney(repSaldo.saldo)}</strong></h5>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "10px" }}>
                                    <CFormInput label="Valor da Baixa" value={vlrPix} onChange={(e) => setVlrPix(e.target.value)} placeholder="0,00" />
                                    <CFormInput label="Observação" value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Motivo..." />
                                </div>
                                <CButton onClick={()=>{registrarBaixasPix()}} color="success" className="mt-3">
                                    Confirmar Baixa
                                </CButton>
                            </div>
                        )}
                    </CTabPane>

                    {/* ABA 2: PEDIDOS */}
                    <CTabPane visible={activeKey === 2}>
                        <div style={{ marginBottom: "20px" }}>
                            <CFormLabel>Lista de Pedidos</CFormLabel>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <CFormInput value={pedidosFilter} onChange={(e) => setPedidosFilter(e.target.value)} placeholder="Ex: 123456, 654321" />
                                <CButton onClick={getPedidosAbatimento} color="primary">Consultar</CButton>
                            </div>
                        </div>

                       {abatimentos.map((ab) => (
                <div key={ab.representante.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                        <h2 style={styles.repTitle}>{ab.representante.descRep}</h2>
                        <span style={styles.badge}>Cod: {ab.representante.codRep}</span>
                    </div>

                    <div style={styles.statsRow}>
                        <div style={styles.statItem}><small>Total Pedidos</small><strong>{formatMoney(ab.vlrTotPedidos)}</strong></div>
                        <div style={styles.statItem}><small>Total Cupons</small><strong>{formatMoney(ab.vlrTotCupons)}</strong></div>
                        <div style={styles.statItem}><small>Abatimento</small><strong style={{ color: '#d97706' }}>{formatMoney(ab.vlrAbatCupom)}</strong></div>
                    </div>

                    <h3 style={styles.subTitle}>Pedidos Relacionados</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Número</th>
                                <th style={styles.th}>NF</th>
                                <th style={styles.th}>Vlr Pdv </th>
                                <th style={styles.th}>Vlr Pdv Pend</th>
                                <th style={styles.th}>Vlr Abat</th>
                                <th style={styles.th}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ab.pedidos.map((p) => (
                                <tr key={p.pdvId}>
                                    <td style={styles.td}>{p.numPedido}</td>
                                    <td style={styles.td}>{p.numNf}</td>
                                    <td style={styles.td}>{formatMoney(p.vlrPdv)}</td>
                                    <td style={styles.td}>{formatMoney(p.vlrAb)}</td>
                                    <td style={styles.td}>{formatMoney(p.vlrAbat)}</td>
                                    <td style={styles.td}>{p.vlrAbat == 0 ? "-" : p.vlrAbat == p.vlrAb ? "Total" : "Parcial"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div style={styles.footerActions}>
                        <CButton onClick={() => registrarBaixas(ab.representante.id)} color="success" style={{ padding: '8px 24px' }}>Baixar Cupom</CButton>
                    </div>
                </div>
            ))}
                    </CTabPane>
                </CTabContent>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    pageContainer: { padding: "24px", maxWidth: "1000px", margin: "0 auto", backgroundColor: "#f8fafc", minHeight: "100vh" },
    searchSection: { backgroundColor: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" },
    card: { backgroundColor: "#fff", padding: "24px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
    repTitle: { fontSize: "1.25rem", color: "#1e293b", margin: 0 },
    badge: { backgroundColor: "#e2e8f0", padding: "4px 12px", borderRadius: "20px", fontSize: "0.85rem", color: "#475569" },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px", backgroundColor: "#f1f5f9", padding: "16px", borderRadius: "8px" },
    statItem: { display: "flex", flexDirection: "column", gap: "4px" },
    subTitle: { fontSize: "1rem", color: "#475569", marginBottom: "12px" },
    table: { width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" },
    th: { textAlign: "left", padding: "10px", fontSize: "0.8rem", textTransform: "uppercase", color: "#94a3b8" },
    td: { padding: "12px", backgroundColor: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" },
    footerActions: { marginTop: "20px", display: "flex", justifyContent: "flex-end", borderTop: "1px solid #e2e8f0", paddingTop: "20px" },
    infoBox: { backgroundColor: "#f8fafc", padding: "15px", borderRadius: "8px", border: "1px solid #e2e8f0" },
    cardItem: { border: "1px solid #e2e8f0", padding: "15px", borderRadius: "8px", marginBottom: "10px" }
};