export interface Coluna  {
    id?: number;
    nomeColunaCsv: string;
    posicaoColuna: number;
};

export interface CsvSisPag  {
    id?: number;
    sistPag: number;
    colunas: Coluna[];
};

export interface validarCsv  {
    sistPagId: number;
    colunas: Coluna[];
};

type ISODateString = string;

export interface Pagamento  {
  id: number | null,
  concId: number | null,
  numEstabelecimento: string;
  dataTransacao: ISODateString; // ISO date
  numTransacao: string;
  idVenda: string;
  bandeira: string;
  formaPagamento: string;
  planoVenda: string;
  parcela: number;
  totalParcela: number;
  numAutorizacao: string;
  tipoCartao: string;
  numCartao: string;
  numTerminal: string;
  tipoCaptura: string;
  indCreditoDebito: string;
  indCancelamentoVenda: string;
  numResumoVenda: string;
  dataPrevistaLiquidacao: ISODateString; // ISO date
  seuNumero: string;
  numOrdemPagamento: string;
  status: string;
  dataPagamento: Date | null, // ISO date
  numBanco: string;
  numAgencia: string;
  numConta: string;
  valorParcelaBruto: number;
  descontoParcela: number;
  valorParcelaLiquido: number;
  totalPlanoVenda: number;
  baixado:number;
  vinculado:number;
};

export interface Conciliacao {
  id: number | null;
  totalNotas:number,
  vlrTotalAutoriz:number,
  vlrAbNotas:number,
  Finalizada:number,
  totalAutoriz:number,
  DataUltParc:Date | null,
  autorizacoes: Autorizacao[];
  notas: NotaFiscal[]
}
export interface NotaFiscal {
  id: number;
  concId: number;
  numNf: number;
  chaveAcesso: number;
  nome: string;
  vlrTotal: number;
  vlrAb: number;
}

export interface Autorizacao {
  id: number | null;
  concId: number | null;
  pagamentoId: number | null;
  numAutorizacao: string,
  totalParc: number;
  vlrTotal: number;
  DataUltParc:Date | null,
}

export type ApiResquestGetNota = {
    numNf: number ;
    chaveAcesso: string;
}