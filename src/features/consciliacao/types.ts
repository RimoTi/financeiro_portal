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

export interface importarCsv  {
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
  dataPagamento: ISODateString; // ISO date
  numBanco: string;
  numAgencia: string;
  numConta: string;
  valorParcelaBruto: number;
  descontoParcela: number;
  valorParcelaLiquido: number;
  totalPlanoVenda: number;
  sistPagId: number;
};

export interface Conciliacao {
  numAutorizacao: string;
  nfsId: number | null;
  transacoes: Transacao[];
}
export interface NotaFiscal {
  id: number;
  numNf: number;
  nome: string;
  vlrTotal: number;
}

interface VincTitNfs {
    nfsSaida: NotaFiscal | null;
}

interface Transacao {
  id: number;
  bandeira: string;
  parcela: number;
  totalParcela: number;
  totalPlanoVenda: number;
  valorParcelaLiquido: number;
  dataTransacao: string;
  numAutorizacao: string;
  vincTitNfs: VincTitNfs | null;
}