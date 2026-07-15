/* eslint-disable @typescript-eslint/no-explicit-any */
import { CCard, CCardBody, CCardHeader, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CButton } from "@coreui/react";
import { formatMoney, formatDate } from "@utils/functions";
import { useEffect, useState } from "react";
import { TituloErp, TitulosPendentesErp } from "../types";
import { baixarTitulosErp, getCuponsPendentesBaixarNoErp } from "../cupom_service";
import { toast } from "react-toastify";
import { Spinner } from "@components/spinner";
import { hasPermission, TipoMenu } from "@features/auth/authService";
import { useAuth } from "@context/useAuth";
import { useNavigate } from "react-router-dom";

export const ListaTitulosPendentesErp: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<TitulosPendentesErp[]>([])
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth()
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
      return
    }
    const tituloErp = data.find(d => d.representante.id == repId);
    const dataResquest = tituloErp ? [tituloErp] : []
    setLoading(true);
    try {
      const resultado = await baixarTitulosErp(dataResquest);
      toast.info(resultado);
      const filterData = data.filter(d => d.representante.id != repId)
      setData(filterData)
      window.dispatchEvent(new CustomEvent("atualizarSidebar"));
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Erro inesperado";
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }

  }

  if (loading) return <Spinner text="Carregando Dados..." />;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Baixa de Títulos</h2>

      {data.map((rep) => (
        <CCard key={rep.representante.id} className="mb-4">
          <CCardHeader style={{ backgroundColor: '#e2e8f0' }}>
            <strong>{rep.representante.descRep}</strong> (Cód: {rep.representante.codRep})
          </CCardHeader>
          <CCardBody>
            <CAccordion flush>
              {rep.titulos.map((tit: TituloErp, index: number) => (
                <CAccordionItem itemKey={index} key={tit.titCupId}>
                  <CAccordionHeader>
                    <div style={{ display: "flex", gap: "30px" }}>
                      <div>Título: {tit.numTit}</div>
                      <div>Valor Baixas: {formatMoney(tit.historicos.reduce((acc, h) => acc + (h.vlrMov || 0), 0))}</div>
                      {/*<div>total baixas: {tit.numTit}</div>
                    <div>Saldo : {tit.numTit}</div>*/}
                    </div>
                  </CAccordionHeader>
                  <CAccordionBody>
                    <CTable hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Data Mov.</CTableHeaderCell>
                          <CTableHeaderCell>Tipo</CTableHeaderCell>
                          <CTableHeaderCell>Valor da Baixa</CTableHeaderCell>
                          <CTableHeaderCell>Saldo Ab</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {tit.historicos.map((h: any, hIndex: number) => (
                          <CTableRow key={hIndex}>
                            <CTableDataCell>{formatDate(h.dtMov)}</CTableDataCell>
                            <CTableDataCell>{h.tpMov}</CTableDataCell>
                            <CTableDataCell>{formatMoney(h.vlrMov)}</CTableDataCell>
                            <CTableDataCell>{formatMoney(h.vlrAbCup)}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable> 
                    {usuario && hasPermission(usuario, TipoMenu.CupomDesconto) && (
                      <CButton onClick={() => navigate(`/detalhes/saldo/cupom/${tit.titCupId}`)} style={{ marginRight: "20px", width:"150px" }} color="primary" >Detalhes</CButton>
                    )}   
                  </CAccordionBody>      
                              
                </CAccordionItem>
              ))}
            </CAccordion>
          </CCardBody>
           {usuario && hasPermission(usuario, TipoMenu.TitulosFinanceiro) && (
            <CButton onClick={() => baixarTitulos(rep.representante.id)} style={{ margin: "20px", width:"150px" }} color="primary" >Baixar</CButton>
          )}
       
        </CCard>
      ))}
    </div>
  );
};