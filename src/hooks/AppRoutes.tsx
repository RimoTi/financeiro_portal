import { JSX, lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
const Layout = lazy(() => import("@components/layout").then(m => ({ default: m.Layout })));
const PrivateRoute = lazy(() => import("./PrivateRoute").then(m => ({ default: m.PrivateRoute })));
const Login = lazy(() => import("@features/auth/pages/Login").then(m => ({ default: m.Login })));

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<div>Carregando...</div>}>{element}</Suspense>
);

export const AppRoutes = createBrowserRouter([
  // 🔹 Rota pública (sem layout)
  { path: "/", element: withSuspense(<Login />) },

  // 🔹 Rotas protegidas (com layout)
  {
    element: withSuspense(<PrivateRoute />), // 🔒 Protege tudo dentro
    children: [
      {
        element: withSuspense(<Layout />), // 🎨 Layout só aparece após login
        children: [
          //{ path: "/home", element: withSuspense(<Home />) },
          //rotas itens de programas
          //{ path: "/item_programa", element: withSuspense(<ItemPrgHome />) },
          //{ path: "/item_programa/create", element: withSuspense(<ItemPrgCreate />) },//formulario de cadastro
          //{ path: "/item_programa/edit/:id", element: withSuspense(<ItemPrgEdit />) },//editar item receber via state
          //{ path: "/item_programa/delete/:id", element: withSuspense(<ItemPrgDelete />) },//confirma delete
          //{ path: "/item_programa/copy/:id", element: withSuspense(<ItemPrgCopy />) },//confirma delete
               ],
      },
      //rotas que não precisam de layout
      //{ path: '/ModeloPdf/cotas/:id_itemPrg/:id_modeloPdf', element: withSuspense(<CotasCreate />) },
    ],
  },

  // 🔹 Rota fallback
  { path: "*", element: withSuspense(<Login />) }, // ideal criar uma pagina de erro quando não achar a rota
],
  { basename: '/financeiro-portal' }   
);
