import { Conciliacao, NotaFiscal, Autorizacao } from "./types";


export const getConciliacoes = async (): Promise<Conciliacao[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(conciliacoesMock);
    }, 500); // simula delay
  });
};

// 🔹 NOTAS FISCAIS
export const notasMock: NotaFiscal[] = [
  {
    id: 1,
    concId: 1,
    numNf: 1001,
    chaveAcesso: 123456789,
    nome: "Cliente A",
    vlrTotal: 150.5,
    vlrAb: 0,
  },
  {
    id: 2,
    concId: 1,
    numNf: 1002,
    chaveAcesso: 987654321,
    nome: "Cliente B",
    vlrTotal: 200,
    vlrAb: 50,
  },
  {
    id: 3,
    concId: 2,
    numNf: 1003,
    chaveAcesso: 555555555,
    nome: "Cliente C",
    vlrTotal: 300,
    vlrAb: 0,
  },
];

// 🔹 AUTORIZAÇÕES
export const autorizacoesMock: Autorizacao[] = [
  {
    id: 1,
    concId: 1,
    totalParc: 3,
    DataUltParc: new Date("2025-03-10"),
  },
  {
    id: 2,
    concId: 1,
    totalParc: 3,
    DataUltParc: new Date("2025-03-10"),
  },
  {
    id: 3,
    concId: 2,
    totalParc: 1,
    DataUltParc: new Date("2025-04-01"),
  },
];

// 🔹 CONCILIAÇÃO
export const conciliacoesMock: Conciliacao[] = [
  {
    id: 1,
    totalNotas: 2,
    totalAutoriz: 2,
    vlrTotalAutoriz: 350.5,
    vlrAbNotas: 50,
    Finalizada: 0,
    DataUltParc: new Date("2025-03-10"),

    autorizacoes: autorizacoesMock.filter(a => a.concId === 1),
    notasFiscais: notasMock.filter(n => n.concId === 1),
  },
  {
    id: 2,
    totalNotas: 1,
    totalAutoriz: 1,
    vlrTotalAutoriz: 300,
    vlrAbNotas: 0,
    Finalizada: 1,
    DataUltParc: new Date("2025-04-01"),

    autorizacoes: autorizacoesMock.filter(a => a.concId === 2),
    notasFiscais: notasMock.filter(n => n.concId === 2),
  },
];