import React from 'react';
import { CCard, CCardBody } from '@coreui/react';
import { formatMoney } from '@utils/functions';
import { Extrato } from '@features/cupom/types';

interface BarraMovimentacaoProps {
    data: Extrato;
}

export const BarraMovimentacao: React.FC<BarraMovimentacaoProps> = ({ data }) => {
    const totalEntradas = data.movimentos
        .filter(m => m.natMov === "E")
        .reduce((ac, mov) => ac + mov.vlrMov, 0);

    const totalSaidas = data.movimentos
        .filter(m => m.natMov === "S")
        .reduce((ac, mov) => ac + Math.abs(mov.vlrMov), 0);

    const volumeTotal = totalEntradas + totalSaidas;

    const porcentagemEntrada = volumeTotal > 0 ? Math.round((totalEntradas / volumeTotal) * 100) : 0;
    const porcentagemSaida = volumeTotal > 0 ? 100 - porcentagemEntrada : 0;

    return (
        <CCard className="mb-4" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <CCardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        Entradas: {formatMoney(totalEntradas)}
                    </span>
                    <span style={{ color: '#c0392b', fontWeight: 'bold' }}>
                        Saídas: {formatMoney(totalSaidas)}
                    </span>
                </div>
                
                <div style={{ 
                    display: 'flex', 
                    height: '14px', 
                    borderRadius: '7px', 
                    backgroundColor: '#e2e8f0', 
                    overflow: 'hidden',
                    width: '100%'
                }}>
                    <div 
                        style={{ 
                            width: `${porcentagemEntrada}%`, 
                            backgroundColor: '#27ae60',
                            height: '100%',
                            transition: 'width 0.3s ease'
                        }} 
                    />
                    <div 
                        style={{ 
                            width: `${porcentagemSaida}%`, 
                            backgroundColor: '#c0392b',
                            height: '100%',
                            transition: 'width 0.3s ease'
                        }} 
                    />
                </div>
            </CCardBody>
        </CCard>
    );
};