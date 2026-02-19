import Categoria from "./Categoria";
import Finalidade from "./Finalidade";
import Usuario from "./Usuario";

export default interface Transacoes {
    Identificador: number,
    Descricao: string,
    Valor: number,
    Finalidade: Finalidade,
    Categoria: Categoria[],
    Pessoa: Usuario,
}