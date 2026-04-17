import React from "react";
import { getTransacoesSemVinculo, getTransacoesPendentesBaixa } from "../../features/consciliacao/consciliacaoService";
import {  Pagamento } from "../../features/consciliacao/types";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const fetchData = async () => {
    try {
      const data = await getTransacoesSemVinculo();
      setPedentesVinculo(data);

      const dataBaixa = await getTransacoesPendentesBaixa();
      setPendentesBaixa(dataBaixa);
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
    fetchData();
  }, [location.pathname]);


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
      <CSidebarNav>
        <CNavTitle>Menu</CNavTitle>

        <CNavItem>
          <Link to="/home" className="nav-link">
            🏠 Home
          </Link>
        </CNavItem>

        {/* DROPDOWN */}
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

        </CNavGroup>
        <CNavItem>
            <Link to="/baixar/ecommerce" className="nav-link">
              📊 Baixar Titulos E-Commerce
            </Link>
          </CNavItem>
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