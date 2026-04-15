import { Pagamento } from "./types"; // ajusta o path se precisar

export const pagamentosMock: Pagamento[] = Array.from({ length: 40 }, (_, i) => {
  const id = i + 1;

  const valorBase = Math.floor(Math.random() * 500) + 50;
  const parcelas = Math.floor(Math.random() * 5) + 1;

  return {
    id: i,
    concId: null,
    numEstabelecimento: "000" + (100 + i),

    dataTransacao: new Date(2025, 2, (i % 28) + 1).toISOString(),
    numTransacao: "TRANS" + id,
    idVenda: "VENDA" + id,

    bandeira: ["VISA", "MASTERCARD", "ELO", "AMEX"][i % 4],
    formaPagamento: ["CRÉDITO", "DÉBITO"][i % 2],
    planoVenda: parcelas > 1 ? `${parcelas}x` : "À VISTA",

    parcela: (i % parcelas) + 1,
    totalParcela: parcelas,

    numAutorizacao: "AUT" + (1000 + i),
    tipoCartao: "CRÉDITO",
    numCartao: "**** **** **** " + String(1000 + i).slice(-4),

    numTerminal: "TERM" + (10 + (i % 5)),
    tipoCaptura: "POS",
    indCreditoDebito: i % 2 === 0 ? "C" : "D",
    indCancelamentoVenda: "N",

    numResumoVenda: "RES" + id,

    dataPrevistaLiquidacao: new Date(2025, 2, (i % 28) + 3).toISOString(),
    seuNumero: "SN" + id,
    numOrdemPagamento: "OP" + id,

    status: ["PENDENTE", "LIQUIDADO"][i % 2],

    dataPagamento: new Date(2025, 2, (i % 28) + 5).toISOString(),

    numBanco: "001",
    numAgencia: "1234",
    numConta: "98765-0",

    valorParcelaBruto: valorBase,
    descontoParcela: Number((valorBase * 0.05).toFixed(2)),
    valorParcelaLiquido: Number((valorBase * 0.95).toFixed(2)),

    totalPlanoVenda: Number((valorBase * parcelas).toFixed(2)),

    sistPagId: 1,
  };
});