/* eslint-disable @typescript-eslint/no-explicit-any */
import { CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton, CBadge } from "@coreui/react";
import { formatMoney, formatDate } from "@utils/functions";
import { useEffect, useState } from "react";
import { TitulosPendentesErp } from "../types";
import { baixarTitulosErp, getCuponsPendentesBaixarNoErp } from "../cupom_service";
import { toast } from "react-toastify";
import { Spinner } from "@components/spinner";
import { hasPermission, TipoMenu } from "@features/auth/authService";
import { useAuth } from "@context/useAuth";
import { useNavigate } from "react-router-dom";

export const ListaTitulosPendentesErp: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TitulosPendentesErp[]>([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const resultado = await getCuponsPendentesBaixarNoErp();
        setData(resultado);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro inesperado";
        toast.error(mensagem);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, []);

  const baixarTitulos = async (repId: number) => {
    if (!window.confirm("Realizar estas baixas?")) {
      return;
    }
    const tituloErp = data.find(d => d.representante.id == repId);
    const dataResquest = tituloErp ? [tituloErp] : [];
    setLoading(true);
    try {
      const resultado = await baixarTitulosErp(dataResquest);
      toast.info(resultado);
      const filterData = data.filter(d => d.representante.id != repId);
      setData(filterData);
      window.dispatchEvent(new CustomEvent("atualizarSidebar"));
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro inesperado";
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Spinner text="Carregando Dados..." />;

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontWeight: "700", color: "#1e293b", margin: 0 }}>Baixa de Títulos</h2>
          <p style={{ color: "#64748b", margin: "4px 0 0 0", fontSize: "0.9rem" }}>Gerencie e efetive as baixas pendentes no ERP</p>
        </div>
      </div>

      {data.length === 0 ? (
        <CCard style={{ textAlign: "center", padding: "40px", border: "none", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <p style={{ color: "#64748b", margin: 0 }}>Nenhum título pendente para baixa no momento.</p>
        </CCard>
      ) : (
        data.map((rep) => (
          <CCard
            key={rep.representante.id}
            className="mb-4"
            style={{ border: "none", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)", overflow: "hidden" }}
          >
            <CCardHeader style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h5 style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '1.05rem' }}>
                  {rep.representante.descRep}
                </h5>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Código: {rep.representante.codRep}
                  </span>

                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    •
                  </span>

                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Total Geral: <strong style={{ color: '#16a34a' }}>
                      {formatMoney(
                        rep.titulos.reduce(
                          (ac, t) => ac + t.historicos.reduce((acc, h) => acc + (h.vlrMov || 0), 0),
                          0
                        )
                      )}
                    </strong>
                  </span>
                </div>
              </div>

              {usuario && hasPermission(usuario, TipoMenu.TitulosFinanceiro) && (
                <CButton
                  onClick={() => baixarTitulos(rep.representante.id)}
                  color="primary"
                  style={{ fontWeight: "500", padding: "8px 20px", borderRadius: "8px", fontSize: "0.9rem" }}
                >
                  Baixar Representante
                </CButton>
              )}
            </CCardHeader>

            <CCardBody style={{ padding: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {rep.titulos.map((tit) => {
                  const totalBaixas = tit.historicos.reduce((acc, h) => acc + (h.vlrMov || 0), 0);

                  return (
                    <div
                      key={tit.titCupId}
                      style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "16px", backgroundColor: "#ffffff" }}
                    >
                      {/* Sub-cabeçalho do Título */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <CBadge color="light" textColor="dark" style={{ fontSize: "0.9rem", padding: "6px 10px", border: "1px solid #cbd5e1" }}>
                            Título: <strong>{tit.numTit}</strong>
                          </CBadge>
                          <span style={{ fontSize: "0.9rem", color: "#475569" }}>
                            Total de Baixas: <strong style={{ color: "#16a34a" }}>{formatMoney(totalBaixas)}</strong>
                          </span>
                        </div>

                        <CButton
                          onClick={() => navigate(`/detalhes/saldo/cupom/${tit.titCupId}`)}
                          color="light"
                          size="sm"
                          style={{ border: "1px solid #cbd5e1", color: "#475569", fontWeight: "500" }}
                        >
                          Ver Detalhes
                        </CButton>
                      </div>

                      {/* Tabela de Históricos limpa */}
                      <div style={{ borderRadius: "6px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                        <CTable hover responsive align="middle" style={{ margin: 0, fontSize: "0.85rem" }}>
                          <CTableHead style={{ backgroundColor: "#f8fafc", color: "#475569" }}>
                            <CTableRow>
                              <CTableHeaderCell style={{ borderBottom: "1px solid #e2e8f0" }}>Data Mov.</CTableHeaderCell>
                              <CTableHeaderCell style={{ borderBottom: "1px solid #e2e8f0" }}>Tipo</CTableHeaderCell>
                              <CTableHeaderCell style={{ borderBottom: "1px solid #e2e8f0" }}>Valor da Baixa</CTableHeaderCell>
                              <CTableHeaderCell style={{ borderBottom: "1px solid #e2e8f0" }}>Saldo Ab</CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {tit.historicos.map((h: any, hIndex: number) => (
                              <CTableRow key={hIndex}>
                                <CTableDataCell>{formatDate(h.dtMov)}</CTableDataCell>
                                <CTableDataCell>
                                  <CBadge color={h.tpMov === 'E' ? 'success' : 'danger'} shape="rounded-pill">
                                    {h.tpMov}
                                  </CBadge>
                                </CTableDataCell>
                                <CTableDataCell style={{ fontWeight: "600", color: "#0f172a" }}>{formatMoney(h.vlrMov)}</CTableDataCell>
                                <CTableDataCell>{formatMoney(h.vlrAbCup)}</CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CCardBody>
          </CCard>
        ))
      )}
    </div>
  );
};