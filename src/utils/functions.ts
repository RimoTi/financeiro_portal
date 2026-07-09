export const formatMoney = (val:number) =>
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });


 export const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString("pt-BR");