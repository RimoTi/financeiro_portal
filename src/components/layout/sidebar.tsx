import React from "react";
import { getTransacoesSemVinculo } from "../../features/consciliacao/consciliacaoService";
import { Conciliacao } from "../../features/consciliacao/types";
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
  const location = useLocation();
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransacoesSemVinculo();
        setConciliacoes(data);
      } catch (error) {
        console.error("Erro ao buscar transações sem vínculo:", error);
      }
    };
    fetchData();
  }, [location.pathname]);


  return (
    <CSidebar
      visible={visible}
      onVisibleChange={onVisibleChange}
      style={{
        display: "flex",
        flexDirection: "column",
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
                <span style={styles.badge}>
                  {conciliacoes.length}
                </span>
              )}
            </div>
          </CNavItem>

          <CNavItem>
            <Link to="/consciliacao/relatorio" className="nav-link">
              📊 Relatórios
            </Link>
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

  badge: {
    position: "absolute" as const,
    top: "2px",
    right: "15px",
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