import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { formatMoney } from "@utils/functions"
import { ListaRepresentantes } from "../types";
import { toast } from "react-toastify";
import { getListaRepresentantes } from "../cupom_service";
import { Spinner } from "@components/spinner";
import { useNavigate } from "react-router-dom";

// Supondo que seus dados venham em um array chamado 'data'
export const ListaRepSaldo: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ListaRepresentantes[]>([])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDados = async () => {
      setLoading(true);
      try {
        const resultado = await getListaRepresentantes();
        setData(resultado);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro inesperado";
        toast.error(mensagem);
      } finally {
        setLoading(false);
      }
    };
    fetchDados();
  }, [])


  if (loading) return <Spinner text="buscando dados" />
  return (
    <div style={{ padding: "20px" }}>
      <h4 style={{ marginBottom: "20px" }}>Saldos dos Representantes</h4>
      <CRow>
        {data.map((item) => (
          <CCol xs={12} md={6} lg={4} key={item.representante.id}>
            <CCard className="mb-4" style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              <CCardHeader style={{ backgroundColor: '#f8fafc', borderBottom: 'none', borderRadius: '12px 12px 0 0', fontWeight: 'bold' }}>
                {item.representante.descRep}
              </CCardHeader>
              <CCardBody>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <small style={{ color: '#64748b' }}>Código: {item.representante.codRep}</small>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>
                      {formatMoney(item.saldo)}
                    </div>
                  </div>
                  <CButton color="primary" variant="outline" size="sm"
                    onClick={() => navigate(`/detalhes/saldo/${item.representante.codRep}`)}
                  >
                    Ver Detalhes
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};