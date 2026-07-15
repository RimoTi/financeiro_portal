import React, { useState } from 'react';
import {
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CButton, CFormInput, CFormLabel, CRow, CCol
} from "@coreui/react";
import { payloadPesquisa } from "@features/cupom/types";

interface PesquisaModalProps {
    onClose: () => void;
    onSearch: (payload: payloadPesquisa) => void;
}

export const PesquisaModal = ({ onClose, onSearch }: PesquisaModalProps) => {
    const [form, setForm] = useState<payloadPesquisa>({
        codigoRepr: null,
        dataInicio: null,
        dataFim: null,
        numPedidoOrigem: null,
        numPedidoAbatimento: null,
    });

    const handleDateChange = (key: 'dataInicio' | 'dataFim', value: string) => {
        // Converte a data do input (string) para objeto Date
        setForm({ ...form, [key]: value ? new Date(value) : null });
    };

    return (
        <CModal visible={true} onClose={onClose} size="lg">
            <CModalHeader closeButton>
                <CModalTitle>Filtrar Histórico</CModalTitle>
            </CModalHeader>

            <CModalBody>
                <div className="mb-3">
                    <CFormLabel>Código do Representante</CFormLabel>
                    <CFormInput
                        type="number"
                        placeholder="Ex: 327"
                        onChange={(e) => setForm({ ...form, codigoRepr: Number(e.target.value) || null })}
                    />
                </div>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <CFormLabel>Data Início</CFormLabel>
                        <CFormInput
                            type="date"
                            onChange={(e) => handleDateChange('dataInicio', e.target.value)}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormLabel>Data Fim</CFormLabel>
                        <CFormInput
                            type="date"
                            onChange={(e) => handleDateChange('dataFim', e.target.value)}
                        />
                    </CCol>
                </CRow>

                <CRow className="mb-3">
                    <CCol md={6}>
                        <CFormLabel>Nº Pedido Origem</CFormLabel>
                        <CFormInput
                            type="number"
                            onChange={(e) => setForm({ ...form, numPedidoOrigem: Number(e.target.value) || null })}
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormLabel>Nº Pedido Abatimento</CFormLabel>
                        <CFormInput
                            type="number"
                            onChange={(e) => setForm({ ...form, numPedidoAbatimento: Number(e.target.value) || null })}
                        />
                    </CCol>
                </CRow>
            </CModalBody>

            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Cancelar</CButton>
                <CButton
                    color="primary"
                    onClick={() => { onSearch(form); onClose(); }}
                >
                    Pesquisar
                </CButton>
            </CModalFooter>
        </CModal>
    );
};