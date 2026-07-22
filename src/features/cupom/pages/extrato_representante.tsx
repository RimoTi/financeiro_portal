import { formatDate, formatMoney } from '@utils/functions';
import React, { CSSProperties, useEffect, useState } from 'react';
import { Extrato, filterExtrato } from '../types';
import { getExtrato } from '../cupom_service';
import { toast } from 'react-toastify';
import { Spinner } from '@components/spinner';
import { useLocation, useNavigate } from 'react-router-dom';
import { CButton } from '@coreui/react';
import { BarraMovimentacao } from './components/barra_mov_extrato';

// Definindo a interface das Props corretamente


export const ExtratoRepresentante: React.FC = () => {
    const [data, setData] = useState<Extrato | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [dataRequest, setDataRequest] = useState<filterExtrato | null>(location.state || null)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (dataRequest == null) return;
                setLoading(true);
                const result = await getExtrato(dataRequest);
                setData(result);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Erro inesperado");
                setDataRequest(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dataRequest]);

    if (loading) return <Spinner text="buscando dados" />;
    if (!data) return <h2>Sem dados para exibir!</h2>;

    // Cálculo do saldo total
    const totalMov = data.movimentos.reduce((acc, mov) => acc + mov.vlrMov, 0);
    const saldoFinal = data.movimentos.reduce((acc, mov) => acc + mov.vlrMov, 0) + data.saldoInicial;

    return (
        <div>
            <div style={styles.container}>
                <header style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Extrato de Cupons</h2>
                        <p style={styles.repInfo}>{data.representante.codRep} - {data.representante.descRep}</p>
                    </div>

                    <CButton
                        color="secondary"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </CButton>
                </header>
<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', gap: '16px' }}>
    {/* Saldo Anterior */}
    <div style={{ 
        flex: 1, 
        backgroundColor: '#f8fafc', 
        padding: '10px 16px', 
        borderRadius: '8px', 
        borderLeft: '4px solid #64748b' 
    }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Saldo Anterior
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b' }}>
            {formatMoney(data.saldoInicial)}
        </span>
    </div>

    {/* Saldo Final */}
    <div style={{ 
        flex: 1, 
        backgroundColor: '#f8fafc', 
        padding: '10px 16px', 
        borderRadius: '8px', 
        borderLeft: `4px solid ${saldoFinal >= 0 ? '#27ae60' : '#c0392b'}` 
    }}>
        <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 'bold' }}>
            Saldo Final
        </span>
        <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: saldoFinal >= 0 ? '#27ae60' : '#c0392b' }}>
            {formatMoney(saldoFinal)}
        </span>
    </div>
</div>

<BarraMovimentacao data={data}/>
            </div>
            <div style={styles.container}>


                <div style={styles.table}>
                    <div style={styles.tableHeader}>
                        <span>Data</span>
                        <span>Tipo</span>
                        <span>Pedido</span>
                        <span style={{ textAlign: 'right' }}>Valor</span>
                    </div>

                    {data.movimentos.map((mov, index) => (
                        <div key={index} style={styles.row}>
                            <span>{formatDate(mov.dtMov)}</span>
                            <span style={styles.type}>{mov.tpMov.replace('_', ' ')}</span>
                            <span>{mov.numPedido || '-'}</span>
                            <span style={{
                                ...styles.value,
                                color: mov.vlrMov >= 0 ? '#27ae60' : '#c0392b'
                            }}>
                                {mov.vlrMov >= 0 ? '+' : ''}{formatMoney(mov.vlrMov)}
                            </span>
                        </div>
                    ))}
                </div>

                <div style={styles.footer}>
                    <span>Total:</span>
                    <span style={{
                        ...styles.value,
                        color: saldoFinal >= 0 ? '#27ae60' : '#c0392b'
                    }}>
                        {formatMoney(totalMov)}
                    </span>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
        maxWidth: '800px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '2px solid #eee',
        marginBottom: '20px',
        paddingBottom: '10px'
    },
    title: { margin: '0 0 5px 0', color: '#2c3e50' },
    repInfo: { margin: 0, color: '#7f8c8d', fontSize: '0.9em' },
    table: { display: 'flex', flexDirection: 'column' },
    tableHeader: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr',
        padding: '10px',
        backgroundColor: '#f8f9fa',
        fontWeight: 'bold',
        color: '#34495e',
        borderRadius: '4px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr',
        padding: '12px 10px',
        borderBottom: '1px solid #f1f1f1',
        alignItems: 'center'
    },
    footer: {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        marginTop: '20px',
        padding: '15px 10px',
        borderTop: '2px solid #eee',
        fontSize: '1.1em',
        fontWeight: 'bold'
    },
    type: { fontSize: '0.85em', fontWeight: 600, color: '#555' },
    value: { textAlign: 'right', fontWeight: 'bold' }
};