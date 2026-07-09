/* eslint-disable @typescript-eslint/no-explicit-any */

import { Spinner } from "@components/spinner";
import { CModal, CModalHeader, CModalTitle, CModalBody, CButton } from "@coreui/react";
import {
    CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow,
    CTableHeaderCell, CTableBody, CTableDataCell, CNav, CNavItem, CNavLink, CTabContent, CTabPane
} from "@coreui/react";
import { formatMoney, formatDate } from "@utils/functions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteAbatimento, getDetalhesSaldo } from "../cupom_service";
import { DetalhesSaldo } from "../types";
import { Abatimento } from "../types"; // Sua interface definida anteriormente

export const DetalhesSaldoCupons: React.FC = () => {
    const [dados, setDados] = useState<DetalhesSaldo | null>(null); // Agora é um objeto único
    const [activeKey, setActiveKey] = useState(1);
    const { codRep } = useParams<{ codRep: string }>();
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [pedidosSelecionados, setPedidosSelecionados] = useState<Abatimento[]>([]);
    const navigate = useNavigate()

    useEffect(() => {
        if (!codRep) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getDetalhesSaldo(codRep);
                setDados(data);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro inesperado");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [codRep]);


    const removerAbatimento = async (abatId: number) => {
        try {
            if (!window.confirm("Essa ação não poderá ser desfeita. Continuar?")) {
                return;
            }
            setLoading(true);

            // Localiza o pedido antes de removê-lo para ter o valor do abatimento
            const pedidoParaRemover = pedidosSelecionados.find(p => p.id === abatId);
            if (!pedidoParaRemover) return;

            const mensagem = await deleteAbatimento(abatId);

            setDados((prev) => {
                if (!prev) return null;
                const novaEstrutura = { ...prev };

                novaEstrutura.cupons = novaEstrutura.cupons.map((cupom) => {
                    // Verifica se este cupom contém o movimento que está sendo alterado
                    const contemMovimento = cupom.historico.some(m =>
                        m.abatimentos?.some(a => a.id === abatId)
                    );

                    if (contemMovimento) {
                        return {
                            ...cupom,
                            // Incrementa o saldo pendente com o valor que foi removido
                            vlrPendente: cupom.vlrPendente + pedidoParaRemover.vlrAbat,
                            historico: cupom.historico.map((mov) => ({
                                ...mov,
                                // Opcional: Se 'vlrMov' no histórico for a soma total, ajuste aqui:
                                vlrAb: mov.vlrAb + pedidoParaRemover.vlrAbat ,
                                vlrMov: mov.vlrMov - pedidoParaRemover.vlrAbat ,
                                abatimentos: mov.abatimentos?.filter((a) => a.id !== abatId) || []
                            }))
                        };
                    }
                    return cupom;
                });

                return novaEstrutura;
            });

            setPedidosSelecionados((prev) => prev.filter((p) => p.id !== abatId));
            toast.info(mensagem);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao remover");
        } finally {
            setLoading(false);
        }
    };

    const verPedidos = (abatimentos: Abatimento[]) => {
        setPedidosSelecionados(abatimentos);
        setModalVisible(true);
    };

    if (loading) return <Spinner text="buscando dados" />;
    if (!dados) return <div>Nenhum dado encontrado.</div>;

    return (
        <div style={{ padding: "24px" }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0", marginBottom: "20px", width: "100%"
            }}>
                <div>
                    <h2>Detalhes: {dados.representante.descRep}</h2>
                    <p className="text-muted">Código: {dados.representante.codRep}</p>
                </div>
                <CButton style={{ backgroundColor: "grey", width: "100px" }} size="sm" onClick={() => navigate(-1)}>
                    ⬅️ Voltar
                </CButton>
            </div>


            {dados.cupons.map((cupom: any) => (
                <CCard key={cupom.id} className="mb-4">
                    <CCardHeader>Título: #{cupom.id} | Data: {formatDate(cupom.dtCadastro)}</CCardHeader>
                    <CCardBody>
                        {/* Resumo Financeiro do Cupom */}
                        <div style={{ display: "flex", gap: "20px", marginBottom: "20px", padding: "10px", background: "#f8f9fa" }}>
                            <div><small>Total Créditos</small><h5>{formatMoney(cupom.totalCreditos)}</h5></div>
                            <div><small>Total Débitos</small><h5>{formatMoney(cupom.totalDebitos)}</h5></div>
                            <div><small>Saldo Pendente</small><h5>{formatMoney(cupom.vlrPendente)}</h5></div>
                        </div>

                        {/* Abas para Créditos e Débitos */}
                        <CNav variant="tabs" role="tablist" className="mb-3">
                            <CNavItem><CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)} style={{ cursor: 'pointer' }}>Créditos</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)} style={{ cursor: 'pointer' }}>Débitos</CNavLink></CNavItem>
                            <CNavItem><CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)} style={{ cursor: 'pointer' }}>Histórico</CNavLink></CNavItem>
                        </CNav>

                        <CTabContent>
                            <CTabPane visible={activeKey === 1}>
                                <CTable hover responsive>
                                    <CTableHead><CTableRow><CTableHeaderCell>Loja</CTableHeaderCell><CTableHeaderCell>Valor Prêmio</CTableHeaderCell><CTableHeaderCell>Status</CTableHeaderCell></CTableRow></CTableHead>
                                    <CTableBody>
                                        {cupom.creditos.map((c: any) => (
                                            <CTableRow key={c.id}>
                                                <CTableDataCell>{c.numPdvLoja}</CTableDataCell>
                                                <CTableDataCell>{formatMoney(c.vlrPremioPdv)}</CTableDataCell>
                                                <CTableDataCell>{c.status}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CTabPane>
                            <CTabPane visible={activeKey === 2}>
                                <CTable hover responsive>
                                    <CTableHead><CTableRow><CTableHeaderCell>Loja</CTableHeaderCell><CTableHeaderCell>Tipo</CTableHeaderCell><CTableHeaderCell>Valor</CTableHeaderCell></CTableRow></CTableHead>
                                    <CTableBody>
                                        {cupom.debitos.map((d: any) => (
                                            <CTableRow key={d.id}>
                                                <CTableDataCell>{d.numPdvLoja}</CTableDataCell>
                                                <CTableDataCell>{d.tipoDeb}</CTableDataCell>
                                                <CTableDataCell>{formatMoney(d.vlrDesc)}</CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CTabPane>
                            <CTabPane visible={activeKey === 3}>
                                <CTable hover responsive>
                                    <CTableHead>
                                        <CTableRow>
                                            <CTableHeaderCell>Data</CTableHeaderCell>
                                            <CTableHeaderCell>Tipo</CTableHeaderCell>
                                            <CTableHeaderCell>Valor Mov</CTableHeaderCell>
                                            <CTableHeaderCell>Pedidos</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {cupom.historico.map((mov: any) => (
                                            <CTableRow key={mov.id}>
                                                <CTableDataCell>{formatDate(mov.dtMov)}</CTableDataCell>
                                                <CTableDataCell>{mov.tpMov}</CTableDataCell>
                                                <CTableDataCell>{formatMoney(mov.vlrMov)}</CTableDataCell>
                                                <CTableDataCell>{mov.abatimentos && mov.abatimentos.length > 0 ?
                                                    (
                                                        <button
                                                            onClick={() => verPedidos(mov.abatimentos)}
                                                            style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                                                            title="Ver Pedidos"
                                                        >
                                                            📰 Pedidos
                                                        </button>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </CTabPane>
                        </CTabContent>
                    </CCardBody>
                </CCard>
            ))}
            <CModal size="lg" visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Pedidos Relacionados</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CTable hover responsive>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell>Pedido</CTableHeaderCell>
                                <CTableHeaderCell>NF</CTableHeaderCell>
                                <CTableHeaderCell>Valor Abatido</CTableHeaderCell>
                                <CTableHeaderCell>Data</CTableHeaderCell>
                                <CTableHeaderCell>Apagar</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {pedidosSelecionados.map((p) => (
                                <CTableRow key={p.id}>
                                    <CTableDataCell>{p.numPedido}</CTableDataCell>
                                    <CTableDataCell>{p.nf}</CTableDataCell>
                                    <CTableDataCell>{formatMoney(p.vlrAbat)}</CTableDataCell>
                                    <CTableDataCell>{formatDate(p.dtAbat.toString())}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton
                                            disabled={p.thistMovCrId !== null}
                                            onClick={() => removerAbatimento(p.id)}>🗑️
                                        </CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                </CModalBody>
            </CModal>
        </div>
    );
};