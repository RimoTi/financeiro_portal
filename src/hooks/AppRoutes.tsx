
import { JSX, lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const Layout = lazy(() => import("@components/layout").then(m => ({ default: m.Layout })));
const PrivateRoute = lazy(() => import("./PrivateRoute").then(m => ({ default: m.PrivateRoute })));
const Login = lazy(() => import("@features/auth/pages/Login").then(m => ({ default: m.Login })));
const Home = lazy(() => import("../pages/home").then(m => ({ default: m.Home })));
const ImportCsvVendas = lazy(() => import("@features/consciliacao/pages/importCsvVendas").then(m => ({ default: m.ImportCsvVendas })));
const ImportCSVPagamentos = lazy(() => import("@features/consciliacao/pages/importCsvPagamentos").then(m => ({ default: m.ImportCsvPagamentos })));
const ConciliacaoSemVinculo = lazy(() => import("@features/consciliacao/pages/pendentesVinculo").then(m => ({ default: m.ConciliacaoSemVinculo })));
const PendentesBaixa = lazy(() => import("@features/consciliacao/pages/pendentesBaixa").then(m => ({ default: m.PendentesBaixa })));
const ImportCsvEcommerce = lazy(() => import("@features/ecommerce/pages/baixarTitulosEcommerce").then(m => ({ default: m.ImportCsvEcommerce })));
const ResultadoBaixaTitulos = lazy(() => import("@features/consciliacao/pages/resultadoBaixaTitulos").then(m => ({ default: m.ResultadoBaixaTitulos })));
const HistoricoMov = lazy(() => import("@features/consciliacao/pages/historicoMov").then(m => ({ default: m.HistoricoMov })));

const ListaRepSaldo = lazy(()=> import("@features/cupom/pages/lista_rep_saldo").then(m=>({default: m.ListaRepSaldo})));
const GerarCupons = lazy(()=> import("@features/cupom/pages/cupons_a_gerar").then(m=>({default: m.GerarCupons})));
const DetalhesCupom = lazy(()=> import("@features/cupom/pages/detalhes_cupom_a_gerar").then(m=>({default: m.DetalhesCupom})));
const AbaterSaldo = lazy(()=> import("@features/cupom/pages/abater_saldo").then(m=>({default: m.AbaterSaldo})));
const DetalhesSaldoCupons = lazy(()=> import("@features/cupom/pages/detalhes_saldo").then(m=>({default: m.DetalhesSaldoCupons})));
const ListaTitulosPendentesErp = lazy(()=> import("@features/cupom/pages/baixar_titulos_erp").then(m=>({default: m.ListaTitulosPendentesErp})));

const withSuspense = (element: JSX.Element) => (
  <Suspense fallback={<div>Carregando...</div>}>{element}</Suspense>
);

export const AppRoutes = createBrowserRouter([
  // 🔹 Rota pública
  { path: "/", element: withSuspense(<Login />) },

  // 🔹 Rotas protegidas
  {
    element: withSuspense(<PrivateRoute />),
    children: [
      {
        element: withSuspense(<Layout />),
        children: [
          { path: "/home", element: withSuspense(<Home />) },
          //rotas de conciliação
          { path: "/consciliacao/importarVendas", element: withSuspense(<ImportCsvVendas />) },
          { path: "/consciliacao/importarPagamentos", element: withSuspense(<ImportCSVPagamentos />) },
          { path: "/consciliacao/semVinculo", element: withSuspense(<ConciliacaoSemVinculo />) },
          { path: "/consciliacao/pendentesBaixa", element: withSuspense(<PendentesBaixa />) },
          { path: "/baixar/ecommerce", element: withSuspense(<ImportCsvEcommerce />) },
          { path: "/consciliacao/retorno", element: withSuspense(<ResultadoBaixaTitulos />) },
          { path: "/consciliacao/historico", element: withSuspense(<HistoricoMov />) },
          
          { path: "/listar/representantes/saldo", element:withSuspense(<ListaRepSaldo/>)},
          { path: "/cupons/a/gerar", element:withSuspense(<GerarCupons/>)},
          { path: "/detalhes/cupons/a/gerar/:id", element:withSuspense(<DetalhesCupom/>)},
          { path: "/abater/pedidos", element:withSuspense(<AbaterSaldo/>)},
          { path: "/detalhes/saldo/:codRep", element:withSuspense(<DetalhesSaldoCupons/>)},
          { path: "/Pendentes/Baixa/Erp", element:withSuspense(<ListaTitulosPendentesErp/>)},
        ],
      },
    ],
  },

  // 🔹 Rota fallback
  { path: "*", element: withSuspense(<Login />) }, 
],
{
  basename: '/financeiro-portal',

});