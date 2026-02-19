'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type Categoria from "@/lib/Interface/Categoria";
import Usuario from "@/lib/Interface/Usuario";

export default function NovaTransacao() {
    const router = useRouter();
    const [idade, setIdade] = useState(0);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState(0);
    const [tipo, setTipo] = useState('');
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [listaCategorias, setListaCategorias] = useState<number[]>([]);

    const params = useParams();

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local
    const id = params.id as string;

    function limparFormulario() {
        setValor(0);
        setDescricao('');
        setTipo('');
        setListaCategorias([]);
    }

    function alternarCategoria(categoriaId: number) {
        setListaCategorias((prev) =>
            prev.includes(categoriaId)
                ? prev.filter((id) => id !== categoriaId)
                : [...prev, categoriaId]
        );
    }

    async function salvarTransacao(e: React.FormEvent) {
        const endpoint = new URL(`/Transacao?user=${id}`, rotaAPI).toString();
        e.preventDefault();
        setMensagem('');
        setTipoMensagem('');

        if (listaCategorias.length === 0) {
            setTipoMensagem('erro');
            setMensagem('Selecione pelo menos uma categoria.');
            return;
        }

        const body = {
            valor,
            descricao,
            tipoId: tipo,
            listaCategorias,
            PessoaIdentificador: id
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (response.ok) {
                setTipoMensagem('sucesso');
                setMensagem('Transação cadastrada com sucesso! Redirecionando...');

                // Redirecionar para página de endereço e telefone
                setTimeout(() => {
                    router.push(`/usuarios/transacoes/${id}`);
                }, 1500);
            } else {
                setTipoMensagem('erro');
                setMensagem(data.message || data.error || 'Erro ao cadastrar Transação');
            }
        } catch (error: any) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao cadastrar transação');
        }
    }

    useEffect(() => {
        async function buscarUsuario() {
            try {
                if (!id)
                    return;

                const endpoint = new URL(`/Pessoa/${id}`, rotaAPI).toString();

                const response = await fetch(endpoint);

                if (!response.ok) {
                    setTipoMensagem('erro');
                    setMensagem('Erro ao buscar a pessoa');
                    return;
                }

                const data = await response.json() as Usuario;

                if (!data) {
                    setTipoMensagem('erro');
                    setMensagem('Pessoa não encontrado');
                    return;
                }

                setIdade(data.idade || 0);

            } catch (error: any) {
                setTipoMensagem('erro');
                setMensagem(error.message || 'Erro ao carregar dados da pessoa');
            }
        }

        buscarUsuario();
    }, [id]);

    useEffect(() => {
        async function BuscarCategorias() {
            if (!tipo) {
                setCategorias([]);
                setListaCategorias([]);
                return;
            }

            const endpointUrl = new URL('/Categoria', rotaAPI);
            endpointUrl.searchParams.set('finalidadeId', tipo);
            const endpoint = endpointUrl.toString();

            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                const categoriasApi: Categoria[] = Array.isArray(data) ? data : [];
                setCategorias(categoriasApi);
                setListaCategorias((prev) => prev.filter((idSelecionado) => categoriasApi.some((c) => c.identificador === idSelecionado)));
            } catch (error: any) {
                setTipoMensagem('erro');
                setMensagem(error.message || 'Erro ao buscar categorias');
            }
        }

        BuscarCategorias();
    }, [tipo]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-6xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Nova Transação</h1>

                {mensagem && (
                    <div className={`p-4 mb-4 rounded-md ${tipoMensagem === 'sucesso'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        <p className="font-semibold">{mensagem}</p>
                    </div>
                )}

                <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={salvarTransacao}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Descrição: <span className="text-red-500">*</span></span>
                            <input
                                type="text"
                                placeholder="Descrição"
                                maxLength={255}
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </label>
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Valor: <span className="text-red-500">*</span></span>
                            <input
                                type="number"
                                placeholder="Valor"
                                value={valor}
                                onChange={(e) => setValor(parseFloat(e.target.value) || 0)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </label>
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Tipo: <span className="text-red-500">*</span></span>
                            <select
                                value={tipo}
                                onChange={(e) => setTipo(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Selecione um tipo</option>
                                <option value="1">Despesa</option>
                                {idade >= 18
                                    ? <option value="2">Receita</option>
                                    : <></>}
                            </select>
                        </label>
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Categorias: <span className="text-red-500">*</span></span>
                            <div className="border border-gray-300 rounded-md px-4 py-3 w-full">
                                {!tipo && (
                                    <p className="text-sm text-gray-500">Selecione o tipo para carregar as categorias.</p>
                                )}

                                {tipo && categorias.length === 0 && (
                                    <p className="text-sm text-gray-500">Nenhuma categoria encontrada para o tipo selecionado.</p>
                                )}

                                {categorias.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {categorias.map((categoria) => (
                                            <label key={categoria.identificador} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={listaCategorias.includes(categoria.identificador)}
                                                    onChange={() => alternarCategoria(categoria.identificador)}
                                                    className="h-4 w-4"
                                                />
                                                <span>{categoria.descricao}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {listaCategorias.length > 0 && (
                                <p className="text-xs text-gray-600 mt-2">
                                    Selecionadas: {
                                        categorias
                                            .filter((categoria) => listaCategorias.includes(categoria.identificador))
                                            .map((categoria) => categoria.descricao)
                                            .join(', ')
                                    }
                                </p>
                            )}
                        </label>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-md"
                        >
                            Salvar
                        </button>
                        <button
                            type="button"
                            onClick={limparFormulario}
                            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-md"
                        >
                            Limpar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}