import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from "@coreui/react";
import React, { useEffect, useState } from "react";
import { formatMoney } from "@utils/functions";
import { SaldoRepresentante, filterExtrato } from "../types";
import { toast } from "react-toastify";
import { getListaRepresentantes } from "../cupom_service";
import { Spinner } from "@components/spinner";
import { useNavigate } from "react-router-dom";
import { ExtratoModal } from "./components/extrato_modal"; // Importe o modal que criamos acima

export const ListaRepSaldo: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<SaldoRepresentante[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para controlar o Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCodRep, setSelectedCodRep] = useState<string | null>(null);

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
  }, []);

  // Abre o modal passando o código do representante da linha clicada
  const abrirModalExtrato = (codRep: string) => {
    setSelectedCodRep(codRep);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setSelectedCodRep(null);
  };

  // Executado ao clicar em "Gerar Extrato" dentro do modal
  const handleGerarExtrato = (filtro: filterExtrato) => {
    fecharModal();
    // Exemplo: Navegar para a tela de extrato passando os dados ou parâmetros via state/rota
     navigate(`/extrato/representante`, { state: filtro });
    //console.log("Filtro gerado:", filtro);
  };

  if (loading) return <Spinner text="buscando dados" />;

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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <CButton color="primary" variant="outline" size="sm"
                      onClick={() => navigate(`/detalhes/saldo/representante/${item.representante.codRep}`)}
                    >
                      Ver Detalhes
                    </CButton>
                    <CButton color="secondary" variant="outline" size="sm"
                      onClick={() => abrirModalExtrato(item.representante.codRep)}
                    >
                      Extrato
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      {/* Renderização do Modal */}
      {selectedCodRep !== null && (
        <ExtratoModal
          visible={modalVisible}
          onClose={fecharModal}
          codRep={selectedCodRep}
          onConfirm={handleGerarExtrato}
        />
      )}
    </div>
  );
};