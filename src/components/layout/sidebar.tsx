import React from "react";
import { getTransacoesSemVinculo, getTransacoesPendentesBaixa } from "../../features/consciliacao/consciliacaoService";
import { Conciliacao, Transacao } from "../../features/consciliacao/types";
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
  const [conciliacoes, setConciliacoes] = React.useState<Conciliacao[]>([]);
  const [pendentesBaixa, setPendentesBaixa] = React.useState<Transacao[]>([]);
  const location = useLocation();
  const fetchData = async () => {
    try {
      const data = await getTransacoesSemVinculo();
      setConciliacoes(data);

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
        <CNavGroup toggler="⚙️ Conciliação">

          <CNavItem>
            <Link to="/consciliacao/importar" className="nav-link">
              📂 Importar CSV
            </Link>
          </CNavItem>

          <CNavItem>
            <div style={styles.navItem}>
              <Link to="/consciliacao/semVinculo" className="nav-link">
                📋 Pendentes Vínculo
              </Link>

              {conciliacoes.length > 0 && (
                <span style={{ ...styles.badge, ...styles.badgeVinculo }}>
                  {conciliacoes.length}
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
                    item.vincTitNfs?.nfsSaida?.id
                  ).length}
                </span>
              )}
            </div>


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