import React, { useState } from "react";
import { useAuth } from "@context/useAuth";
import { Sidebar } from "@components/layout/sidebar";
import { Header } from "@components/layout/header";
import { Outlet } from "react-router-dom";

export const Layout: React.FC = () => {
  const { usuario } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  if (!usuario) {
    return <span>Não logado</span>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar controlada por props */}

<div
  style={{
    width: sidebarVisible ? "350px" : "0px",
    transition: "width 0.3s",
    overflow: "hidden",
    height: sidebarVisible ? "100vh" : "0px",
  }}
>
  <Sidebar 
    visible={sidebarVisible}
    onVisibleChange={(val) => setSidebarVisible(val)}
  />
</div>



      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header onToggleSidebar={() => setSidebarVisible(!sidebarVisible)} />

        <main style={{ flex: 1, padding: "1rem" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
