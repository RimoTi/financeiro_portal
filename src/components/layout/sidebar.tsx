import React from "react";
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
            <Link to="/consciliacao/lista" className="nav-link">
              📋 Lista
            </Link>
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
