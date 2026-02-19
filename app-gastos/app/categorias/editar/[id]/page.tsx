'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Categoria from "@//lib/Interface/Categoria";

export default function EditarCategoria() {
    const router = useRouter();
    const params = useParams();

    const [descricao, setDescricao] = useState('');
    const [finalidadeId, setFinalidade] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local
    const id = params.id as string;


    function limparFormulario() {
        setDescricao('');
        setFinalidade('');
    }


    useEffect(() => {
        async function buscarCategoria() {
            try {
                const endpoint = new URL(`/Categoria/${id}`, rotaAPI).toString();

                const response = await fetch(endpoint);

                if (!response.ok) {
                    setTipoMensagem('erro');
                    setMensagem('Erro ao buscar a categoria');
                    return;
                }

                const data = await response.json() as Categoria;

                if (!data) {
                    setTipoMensagem('erro');
                    setMensagem('Categoria não encontrada');
                    return;
                }

                setDescricao(data.descricao);
                setFinalidade(data.finalidadeId ? data.finalidadeId.toString() : '');

            } catch (error: any) {
                setTipoMensagem('erro');
                setMensagem(error.message || 'Erro ao carregar dados da categoria');
            }
            //  finally {
            //     setLoading(false);
            // }
        }

        if (id) {
            buscarCategoria();
        }
    }, [id]);

    async function salvarCategoria(e: React.FormEvent) {
        const endpoint = new URL(`/Categoria/${id}`, rotaAPI).toString();
        e.preventDefault();
        setMensagem('');
        setTipoMensagem('');

        const body = {
            descricao,
           finalidadeId,
        }

        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });


            if (response.ok) {
                setTipoMensagem('sucesso');
                setMensagem('Categoria atualizada com sucesso! Redirecionando...');

                // Redirecionar para página de endereço e telefone
                setTimeout(() => {
                    router.push(`/categorias`);
                }, 1500);
            } else {
                const data = await response.json();

                setTipoMensagem('erro');
                setMensagem(data.message || data.error || 'Erro ao atualizar Categoria');
            }
        } catch (error: any) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao atualizar Categoria');
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-6xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Atualizar Categoria</h1>

                {mensagem && (
                    <div className={`p-4 mb-4 rounded-md ${tipoMensagem === 'sucesso'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        <p className="font-semibold">{mensagem}</p>
                    </div>
                )}

                <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={salvarCategoria}>

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
                            <span className="font-semibold text-sm mb-2">Finalidade: <span className="text-red-500">*</span></span>
                            <select
                                value={finalidadeId}
                                onChange={(e) => setFinalidade(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="" disabled>Selecione uma finalidade</option>
                                <option value="1">Despesa</option>
                                <option value="2">Receita</option>
                            </select>

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