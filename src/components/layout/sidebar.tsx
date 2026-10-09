import React from "react";
import { getTransacoesSemVinculo, getTransacoesPendentesBaixa } from "../../features/consciliacao/consciliacaoService";
import { getTotalCuponsGerar, getCuponsPendentesBaixarNoErp } from "@features/cupom/cupom_service"
import { Pagamento } from "../../features/consciliacao/types";
import { useLocation } from "react-router-dom";
import { hasPermission, TipoMenu } from "@features/auth/authService";
import { useAuth } from "@context/useAuth";

import {
  CSidebar,
  CSidebarNav,
  CNavTitle,
  CNavItem,
  CNavGroup
} from "@coreui/react";
import { Link } from "react-router-dom";

interface SidebarProps {
  visible: boolean;
  onVisibleChange: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ visible, onVisibleChange }) => {
  const [pedentesVinculo, setPedentesVinculo] = React.useState<Pagamento[]>([]);
  const [pendentesBaixa, setPendentesBaixa] = React.useState<Pagamento[]>([]);
  const [cuponsGerar, setCuponsGerar] = React.useState<number>(0);
  const [cupPendBaixErp, setCupPendBaixErp] = React.useState<number>(0);
  const location = useLocation();
  const { usuario } = useAuth();
  const fetchData = async () => {
    try {
      const data = await getTransacoesSemVinculo();
      setPedentesVinculo(data);

      const dataBaixa = await getTransacoesPendentesBaixa();
      setPendentesBaixa(dataBaixa);

      const dataCuponGerar = await getTotalCuponsGerar();
      setCuponsGerar(dataCuponGerar);

      const dataPendenteBaixaErp = await getCuponsPendentesBaixarNoErp();
      setCupPendBaixErp(dataPendenteBaixaErp.length || 0)
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const atualizar = () => {
      fetchData();
    };

    window.addEventListener("atualizarSidebar", atualizar);

    return () => {
      window.removeEventListener("atualizarSidebar", atualizar);
    };
  }, []);

  React.useEffect(() => {
    let isMounted = true; // Flag de controle

    const fetchData = async () => {
      try {
        const [dataVinculo, dataBaixa] = await Promise.all([
          getTransacoesSemVinculo(),
          getTransacoesPendentesBaixa()
        ]);

        if (isMounted) {
          setPedentesVinculo(dataVinculo);
          setPendentesBaixa(dataBaixa);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cancela a atualização se o componente desmontar
    };

  }, [location.pathname]); // O efeito depende de location.pathname


  return (
    <CSidebar
      visible={visible}
      onVisibleChange={onVisibleChange}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "350px",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <CSidebarNav onClick={fetchData}>
        <CNavTitle>Menu</CNavTitle>

        <CNavItem>
          <Link to="/home" className="nav-link">
            🏠 Home
          </Link>
        </CNavItem>

        {/* DROPDOWN */}
        {usuario && hasPermission(usuario, TipoMenu.TitulosFinanceiro) && (
          <CNavGroup toggler="⚙️ Conciliação 💳">

            <CNavItem>
              <Link to="/consciliacao/importarVendas" className="nav-link">
                📂 Importar CSV (Vendas)
              </Link>
            </CNavItem>

            <CNavItem>
              <Link to="/consciliacao/importarPagamentos" className="nav-link">
                📂 Importar CSV (Pagamentos)
              </Link>
            </CNavItem>

            <CNavItem>
              <div style={styles.navItem}>
                <Link to="/consciliacao/semVinculo" className="nav-link">
                  📋 Pendentes Vínculo
                </Link>

                {pedentesVinculo.length > 0 && (
                  <span style={{ ...styles.badge, ...styles.badgeVinculo }}>
                    {pedentesVinculo.length}
                  </span>
                )}
              </div>
            </CNavItem>
            <CNavItem>
              <div style={styles.navItem}>
                <Link to="/consciliacao/pendentesBaixa" className="nav-link">
                  📊 Baixar Títulos
                </Link>

                {pendentesBaixa.length > 0 && (
                  <span style={{ ...styles.badge, ...styles.badgeBaixa }}>
                    {pendentesBaixa.filter((item) =>
                      item.concId != null && item.concId != undefined
                    ).length}
                  </span>
                )}
              </div>
            </CNavItem>
            <CNavItem>
              <Link to="/consciliacao/historico" className="nav-link">
                📝 Histórico de Movimentações
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to="/consciliacao/confirmarExclusao" className="nav-link">
                🗑️ Excluir Consciliação 
              </Link>
            </CNavItem>

          </CNavGroup>
        )}
        {usuario && hasPermission(usuario, TipoMenu.TitulosFinanceiro) && (
          <CNavItem>
            <Link to="/baixar/ecommerce" className="nav-link">
              📊 Baixar Titulos E-Commerce
            </Link>
          </CNavItem>
        )}
        <CNavGroup toggler="🏷️ Cupons">
          <CNavItem>
            <Link to="/listar/representantes/saldo" className="nav-link">
              📰 Saldo Acumulado
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/pesquisar/cupons" className="nav-link">
              🔎 Localizar Cupom
            </Link>
          </CNavItem>
          {usuario && hasPermission(usuario, TipoMenu.TitulosFinanceiro) && (
            <CNavItem>
              <div style={styles.navItem}>
                <Link to="/cupons/a/gerar" className="nav-link">
                  💸 Gerar Titulos Cup
                </Link>
                {cuponsGerar > 0 && (
                  <span style={{ ...styles.badge, ...styles.badgeTitGerar }}>
                    {cuponsGerar}
                  </span>
                )}
              </div>
            </CNavItem>
          )}
          {usuario && hasPermission(usuario, TipoMenu.CupomDesconto) && (
            <CNavItem>
              <Link to="/abater/pedidos" className="nav-link">
                💰 Abater Saldo
              </Link>
            </CNavItem>
          )}
            <CNavItem>
              <div style={styles.navItem}>
                <Link to="/Pendentes/Baixa/Erp" className="nav-link">
                  💲 Baixar Titulos
                </Link>
                {cupPendBaixErp > 0 && (
                  <span style={{ ...styles.badge, ...styles.badgeTitBaixar }}>
                    {cupPendBaixErp}
                  </span>
                )}
              </div>
            </CNavItem>
        </CNavGroup>
      </CSidebarNav>


    </CSidebar>
  );
};


const styles = {
  navItem: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },

  badgeVinculo: { left: "205px" },
  badgeBaixa: { left: "165px" },
  badgeTitGerar: { left: "200px" },
  badgeTitBaixar: { left: "180px" },

  badge: {
    position: "absolute" as const,
    top: "2px",
    backgroundColor: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  }
};