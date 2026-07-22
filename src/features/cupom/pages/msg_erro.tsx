import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CBadge } from "@coreui/react";
import { BaixasIndevidas } from '../types';
import { useLocation } from 'react-router-dom';
import { Spinner } from '@components/spinner';
import { toast } from 'react-toastify';
import { getDetalhesCupom } from '../cupom_service';
export const MsgErro: React.FC = () => {
  const location = useLocation();
  const [dados, setDados] = useState<BaixasIndevidas[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificação de segurança: state pode vir nulo
    const baixasOriginais: BaixasIndevidas[] = location.state || [];

    const carregarDetalhes = async () => {
      if (baixasOriginais.length === 0) return;

      setLoading(true);
      try {
        // Usamos Promise.all para carregar os detalhes em paralelo (mais rápido que for)
        const baixasAtualizadas = await Promise.all(
          baixasOriginais.map(async (b) => {
            const cup = await getDetalhesCupom(b.titCupId.toString());
            // Retornamos um novo objeto com o representante incluído
            return { ...b, representante: cup.representante };
          })
        );
        setDados(baixasAtualizadas);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Erro desconhecido";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    carregarDetalhes();
  }, [location.state]);

  if (loading) return <Spinner text="Carregando dados..." />

  return (
    <CRow>
      <h3 style={{color:"red", fontSize:"45px"}}>⚠️ Movimentações feitas fora de nosso controle!</h3>
      {dados.map((item) => (
        <CCol xs={12} md={6} lg={4} key={item.thistMovCrId} className="mb-4">
          <CCard className="h-100 shadow-sm">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Título: {item.numTit}</strong>
              <CBadge color="info">{(item.representante ? item.representante.codRep : "-")} - {(item.representante ? item.representante.descRep : "")}</CBadge>
            </CCardHeader>
            <CCardBody>
              <div className="mb-2">
                📅 {new Date(item.dtMov).toLocaleDateString()}
              </div>

              <div className="mb-2 text-primary fw-bold">
                💰 Valor: R$ {item.vlrMov.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>

              <div className="mb-2 border-top pt-2">
                <small className="text-muted d-block">Histórico:</small>
                {item.historico}
              </div>

              <div className="text-muted small">
                🙍‍♂️ {item.usuario}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  );
}