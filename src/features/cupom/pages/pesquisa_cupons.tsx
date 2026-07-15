/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
    CCard, CCardBody, CCardHeader, CButton, CTable, CTableHead,
    CTableRow, CTableHeaderCell, CTableBody, CTableDataCell
} from "@coreui/react";
import { formatDate, formatMoney } from "@utils/functions";
import { toast } from "react-toastify";
import { pesquisarCupons } from '../cupom_service'; // Ajuste o caminho
import { DetalhesSaldo } from '../types';
import { payloadPesquisa } from "@features/cupom/types";
import { PesquisaModal } from "./components/pesquisa_modal"; // Seu componente modal
import { Spinner } from "@components/spinner";
import { useNavigate } from 'react-router-dom';


export const PesquisaCupons: React.FC = () => {
    const [dados, setDados] = useState<DetalhesSaldo[]>(() => {
        const dadosSalvos = localStorage.getItem('ultimaPesquisaDados');
        return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    });
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate()

    const handlePesquisar = async (payload: payloadPesquisa) => {
        try {
            setLoading(true);
            const data = await pesquisarCupons(payload);
            setDados(data);
            localStorage.setItem('ultimaPesquisaDados', JSON.stringify(data));
            localStorage.setItem('ultimaPesquisaPayload', JSON.stringify(payload));
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro na busca");
            setDados([]);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2>Histórico de Cupons e Abatimentos</h2>
                <CButton color="primary" onClick={() => setModalVisible(true)}>
                    🔎 Pesquisar Dados
                </CButton>
            </div>

            {loading ? <Spinner text="Buscando..." /> : (
                dados.map((item) => (
                    <CCard key={item.representante.id} className="mb-4">
                        <CCardHeader>
                            <strong>Representante:</strong> {item.representante.codRep} - {item.representante.descRep}
                        </CCardHeader>
                        <CCardBody>
                            <CTable hover responsive>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>Valor Titulo</CTableHeaderCell>
                                        <CTableHeaderCell>Valor Pendente</CTableHeaderCell>
                                        <CTableHeaderCell>Data Cadastro</CTableHeaderCell>
                                        <CTableHeaderCell>Ações</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {item.cupons.map((cupom) => (
                                        <CTableRow key={cupom.id}>
                                            <CTableDataCell>{formatMoney(cupom.vlrTit)}</CTableDataCell>
                                            <CTableDataCell>{formatMoney(cupom.vlrPendente)}</CTableDataCell>
                                            <CTableDataCell>{formatDate(cupom.dtCadastro.toString())}</CTableDataCell>
                                            <CTableDataCell>
                                                <CButton size="sm" color="info" onClick={() => navigate(`/detalhes/saldo/cupom/${cupom.id}`)}>
                                                    Ver Detalhes
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                ))
            )}

            {modalVisible && (
                <PesquisaModal
                    onClose={() => setModalVisible(false)}
                    onSearch={handlePesquisar}
                />
            )}
        </div>
    );
};