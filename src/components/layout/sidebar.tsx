import React from "react";
import { CSidebar, CSidebarNav, CNavItem, CNavTitle } from "@coreui/react";
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
        <CNavItem>
          <Link to="/consciliacao" className="nav-link">
            ⚙️ Conciliação
          </Link>
        </CNavItem>
      </CSidebarNav>
    </CSidebar>
  );
};
