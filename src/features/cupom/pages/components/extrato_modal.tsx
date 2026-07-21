import React, { useState } from 'react';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput } from '@coreui/react';
import { filterExtrato } from '../../types'; 

interface ExtratoModalProps {
  visible: boolean;
  onClose: () => void;
  codRep: string;
  onConfirm: (filtro: filterExtrato) => void;
}

export const ExtratoModal: React.FC<ExtratoModalProps> = ({ visible, onClose, codRep, onConfirm }) => {
  // Estados para as datas (usando string no formato 'YYYY-MM-DD' para o input type="date")
  const [dataIni, setDataIni] = useState('');
  const [dataFim, setDataFim] = useState('');

  const handleConfirm = () => {
    if (!dataIni || !dataFim) {
      alert('Por favor, preencha a data de início e de fim.');
      return;
    }

    // Monta o objeto no formato filterExtrato convertido para tipo Date
    const filtro: filterExtrato = {
      codRep: codRep,
      dataIni: new Date(dataIni + 'T00:00:00'), // Garante o fuso correto
      dataFim: new Date(dataFim + 'T23:59:59')
    };

    onConfirm(filtro);
  };

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>Filtrar Extrato (Rep: {codRep})</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Data Início:</label>
          <CFormInput 
            type="date" 
            value={dataIni} 
            onChange={(e) => setDataIni(e.target.value)} 
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Data Fim:</label>
          <CFormInput 
            type="date" 
            value={dataFim} 
            onChange={(e) => setDataFim(e.target.value)} 
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={onClose}>
          Cancelar
        </CButton>
        <CButton color="primary" onClick={handleConfirm}>
          Gerar Extrato
        </CButton>
      </CModalFooter>
    </CModal>
  );
};