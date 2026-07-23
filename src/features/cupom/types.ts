interface Credito {
  id: number;
  pdvId: number;
  dtCadastro: string;
  vlrPdv: number;
  vlrPremioPdv: number;
  vlrIpiSer: number;
  vlrBaseSer: number;
  vlrPremSer: number;
  vlrIpiMod: number;
  vlrBaseMod: number;
  vlrPremMod: number;
  dtPdv: string;
  numPdvLoja: number;
  repId: number;
  status: string;
  checkado: boolean;
  titCupId: number | null;
}

interface Debito {
  id: number;
  pdvId: number;
  dtCadastro: string;
  vlrPdv: number;
  vlrPremioPdv: number;
  vlrIpiSer: number;
  vlrBaseSer: number;
  vlrPremSer: number;
  vlrIpiMod: number;
  vlrBaseMod: number;
  vlrPremMod: number;
  dtPdv: string;
  numPdvLoja: number;
  repId: number;
  tipoDeb: string;
  vlrDesc: number;
  vlrPend: number;
  status: string;
  checkado: boolean;
  titCupId: number | null;
}

interface Representante {
  id: number;
  codRep: string;
  descRep: string;
}

export interface SaldoRepresentante {
  representante: Representante;
  saldo: number;
}

export interface DadosGerarCupon {
  representante: Representante;
  creditos: Credito[];
  debitos: Debito[];
  cupon: Cupom;
}

export interface Cupom {
  id: number | null;
  repId: number;
  ttitCrId: number | null;
  vlrTit: number;
  vlrPendente: number;
  observacao: string;
  dtCadastro: Date;
  totalCreditos: number;
  totalDebitos: number;
  totalDebitosAbat: number;
  historico: Historico[];
  representante: Representante | null;
}

export interface Abatimento {
  representante: Representante;
  vlrTotPedidos: number;
  vlrTotCupons: number;
  vlrAbatCupom: number;
  vlrResidPedidos: number;
  cuponsPendentes: Cupom[];
  pedidos: Pedido[];
}

export interface DetalhesSaldo {
  representante: Representante;
  cupons: Cupom[];
}

interface Historico {
  id: number;
  titCupId: number;
  ttitCrId: number;
  thistMovCrId: number;
  dtMov: Date;
  vlrMov: number;
  vlrAb: number;
  tpMov: string;
  abatimentos: Abatimento[];
}

export interface TituloErp {
  titCupId: number;
  ttitCrId: number;
  numTit: string;
  parcela: number;
  historicos: HistoricoErp[];
}

export interface TitulosPendentesErp {
  representante: Representante;
  titulos: TituloErp[];
}
interface HistoricoErp {
  tfHistTitCupId: number;
  dtMov: Date;
  vlrMov: number;
  vlrAbCup: number;
  tpMov: string;
}

export interface Abatimento {
  id: number;
  pdvId?: number | null;
  vlrPdv?: number | null;
  numPedido?: number | null;
  nf?: number | null;
  vlrAbat: number;
  dtAbat: Date; // Ou Date, se você fizer a conversão no parse do JSON
  repId: number;
  titCupId: number;
  observacao?: string | null;
  thistMovCrId: number | null;
}

interface Pedido {
  pdvId: number;
  numPedido: number;
  numNf: number;
  vlrPdv: number;
  vlrAbat: number;
  vlrAb: number;
  dtAbat: Date;
}

export interface MovimentoBaixa {
  numerosPedidos: number[];
  observacao: string;
  baixaAvulsa: {
    codRep: string;
    valor: number;
  } | null;
}

export type payloadPesquisa = {
  codigoRepr: number | null;
  dataInicio: Date | null;
  dataFim: Date | null;
  numPedidoOrigem: number | null;
  numPedidoAbatimento: number | null;
};

export type BaixasIndevidas = {
    thistMovCrId: number;
    titCrId: number;
    titCupId: number;
    numTit: number;
    dtMov: Date;
    vlrMov: number;
    historico: string;
    usuario: string;
    representante: Representante | null;
}

export type Extrato = {
  representante: Representante;
  saldoInicial:number;
  movimentos : Movimento[]
}


export type Movimento = {
  titCupId: number;
  numTit: number;
  numPedido: number | null;
  dtMov: string;
  vlrMov: number;
  tpMov: string;
  natMov: string;
}

export type filterExtrato = {
  codRep: string;
  mes : number;
  ano: number;
}
