// App.tsx
import React from "react";
import { ToastContainer } from 'react-toastify'; // Importa o container
import { RouterProvider } from "react-router-dom";
import { AppRoutes } from "./hooks/AppRoutes";

const App: React.FC = () => (
  <>
  
  <ToastContainer 
        position="top-right" // Posição padrão dos toasts
        autoClose={3000}    // Tempo de fechamento automático (3 segundos)
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // 'light', 'dark' ou 'colored'
      />
        <RouterProvider router={AppRoutes}/>
      </>

);

export default App;