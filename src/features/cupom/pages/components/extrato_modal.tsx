import React, { useState } from 'react';
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormInput, CFormSelect } from '@coreui/react';
import { filterExtrato } from '../../types'; 

interface ExtratoModalProps {
  visible: boolean;
  onClose: () => void;
  codRep: string;
  onConfirm: (filtro: filterExtrato) => void;
}

export const ExtratoModal: React.FC<ExtratoModalProps> = ({ visible, onClose, codRep, onConfirm }) => {
  // Estados para as datas (usando string no formato 'YYYY-MM-DD' para o input type="date")
  const [mesInput, setMesInput] = useState(0);
  const [anoInput, setAnoInput] = useState(new Date().getFullYear());

  const handleConfirm = () => {
    if (mesInput == 0 || anoInput == 0) {
      alert('Por favor, Informe corretamente mes e ano');
      return;
    }

    // Monta o objeto no formato filterExtrato convertido para tipo Date
    const filtro: filterExtrato = {
      codRep: codRep,
      mes: mesInput, 
      ano: anoInput
    };

    onConfirm(filtro);
  };

  const meses = [
    { valor: 0, rotulo: 'Selecione o Mês' },    
    { valor: 1, rotulo: 'Janeiro' },
    { valor: 2, rotulo: 'Fevereiro' },
    { valor: 3, rotulo: 'Março' },
    { valor: 4, rotulo: 'Abril' },
    { valor: 5, rotulo: 'Maio' },
    { valor: 6, rotulo: 'Junho' },
    { valor: 7, rotulo: 'Julho' },
    { valor: 8, rotulo: 'Agosto' },
    { valor: 9, rotulo: 'Setembro' },
    { valor: 10, rotulo: 'Outubro' },
    { valor: 11, rotulo: 'Novembro' },
    { valor: 12, rotulo: 'Dezembro' }
  ];

  return (
    <CModal visible={visible} onClose={onClose} alignment="center">
      <CModalHeader>
        <CModalTitle>Filtrar Extrato (Rep: {codRep})</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Data Início:</label>
         <CFormSelect aria-label="Selecione o mês" onChange={(e)=>setMesInput(Number(e.target.value))} value={mesInput}>          
          {meses.map((mes) => (
            <option key={mes.valor} value={mes.valor}>
              {mes.rotulo}
            </option>
          ))}
        </CFormSelect>
        </div>
        <div>
          <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Ano:</label>
          <CFormInput 
            type="number" 
            value={anoInput} 
            onChange={(e) => setAnoInput(Number(e.target.value))} 
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