/* eslint-disable @typescript-eslint/no-explicit-any */
import { CCard, CCardBody, CCardHeader, CButton, CBadge } from "@coreui/react";
import { formatMoney, formatDate } from "@utils/functions";
import { useEffect, useState } from "react";
import { TitulosPendentesErp } from "../types";
import { baixarTitulosErp, getCuponsPendentesBaixarNoErp } from "../cupom_service";
import { toast } from "react-toastify";
import { Spinner } from "@components/spinner";
import { hasPermission, TipoMenu } from "@features/auth/authService";
import { useAuth } from "@context/useAuth";

export const ListaTitulosPendentesErp: React.FC = () => {
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

  // Função auxiliar para agrupar todos os abatimentos por Pedido dentro de um representante
  const agruparPorPedido = (titulos: any[]) => {
    const mapaPedidos = new Map<string, {
      numPedido: any;
      numNf: any;
      vlrPdv: number;
      dtAbat: string;
      itens: Array<{ numTit: string; parcela: number; vlrAbat: number; vlrAb: number }>
    }>();

    titulos.forEach((tit) => {
      tit.historicos.forEach((h: any) => {
        h.abatimentos?.forEach((ab: any) => {
          const chave = `${ab.numPedido}-${ab.numNf}`;
          if (!mapaPedidos.has(chave)) {
            mapaPedidos.set(chave, {
              numPedido: ab.numPedido,
              numNf: ab.numNf,
              vlrPdv: ab.vlrPdv,
              dtAbat: ab.dtAbat,
              itens: []
            });
          }
          mapaPedidos.get(chave)?.itens.push({
            numTit: tit.numTit,
            parcela: tit.parcela,
            vlrAbat: ab.vlrAbat,
            vlrAb: ab.vlrAb
          });
        });
      });
    });

    return Array.from(mapaPedidos.values());
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
        data.map((rep) => {
          const totalGeralRep = rep.titulos.reduce(
            (ac, t) => ac + t.historicos.reduce((acc, h) => acc + (h.vlrMov || 0), 0),
            0
          );
          const pedidosAgrupados = agruparPorPedido(rep.titulos);

          return (
            <CCard
              key={rep.representante.id}
              className="mb-4"
              style={{ border: "none", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)", overflow: "hidden" }}
            >
              <CCardHeader style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h5 style={{ margin: 0, fontWeight: '600', color: '#0f172a', fontSize: '1.05rem' }}>
                    {rep.representante.descRep}
                  </h5>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Código: {rep.representante.codRep}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>•</span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      Total Geral: <strong style={{ color: '#16a34a' }}>{formatMoney(totalGeralRep)}</strong>
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
                  {pedidosAgrupados.map((ped, index) => {
                    const totalBaixadoPedido = ped.itens.reduce((acc, item) => acc + item.vlrAbat, 0);
                    // O saldo restante do pedido com base no primeiro item (ou você pode ajustar conforme sua regra de negócio)
                    const saldoRestantePedido = ped.itens.length > 0 ? ped.itens[0].vlrAb : 0;

                    return (
                      <div
                        key={index}
                        style={{ border: "1px solid #cbd5e1", borderRadius: "8px", padding: "16px", backgroundColor: "#ffffff" }}
                      >
                        {/* Cabeçalho do Pedido */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                            <CBadge color="dark" style={{ fontSize: "0.9rem", padding: "6px 12px" }}>
                              Pedido: <strong>{ped.numPedido}</strong>
                            </CBadge>
                            <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                              NF: <strong>{ped.numNf}</strong>
                            </span>
                            <span style={{ fontSize: "0.85rem", color: "#475569" }}>
                              Data: <strong>{formatDate(ped.dtAbat)}</strong>
                            </span>
                          </div>

                          <div style={{ display: "flex", gap: "16px", fontSize: "0.85rem" }}>
                            <span>Valor do Pedido: <strong style={{ color: "#0f172a" }}>{formatMoney(ped.vlrPdv)}</strong></span>
                            <span>Total Baixado: <strong style={{ color: "#16a34a" }}>{formatMoney(totalBaixadoPedido)}</strong></span>
                            <span>Restante (Saldo): <strong style={{ color: "#d97706" }}>{formatMoney(saldoRestantePedido)}</strong></span>
                          </div>
                        </div>

                        {/* Distribuição por Título */}
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "6px", fontWeight: "600" }}>
                          Títulos afetados por este pedido:
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {ped.itens.map((item, itemIdx) => (
                            <div key={itemIdx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc", padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.82rem" }}>
                              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                <span style={{ color: "#0f172a" }}>Título: <strong>{item.numTit}</strong> (Parcela {item.parcela})</span>
                              </div>
                              <div>
                                <span style={{ color: "#64748b" }}>Valor Baixado neste Título: </span>
                                <strong style={{ color: "#16a34a" }}>{formatMoney(item.vlrAbat)}</strong>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CCardBody>
            </CCard>
          );
        })
      )}
    </div>
  );
};