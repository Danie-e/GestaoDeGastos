'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovaCategoria() {
    const router = useRouter();
    const [descricao, setDescricao] = useState('');
    const [finalidadeId, setFinalidade] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local


    function limparFormulario() {
        setDescricao('');
        setFinalidade('');
    }

    async function salvarCategoria(e: React.FormEvent) {
        const endpoint = new URL('/Categoria', rotaAPI).toString();
        e.preventDefault();
        setMensagem('');
        setTipoMensagem('');

        const body = {
            descricao,
            finalidadeId,
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
                setMensagem('Categoria cadastrada com sucesso! Redirecionando...');

                // Redirecionar para página de endereço e telefone
                setTimeout(() => {
                    router.push(`/categorias`);
                }, 1500);
            } else {
                setTipoMensagem('erro');
                setMensagem(data.message || data.error || 'Erro ao cadastrar Categoria');
            }
        } catch (error: any) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao cadastrar Categoria');
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-6xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Nova Categoria</h1>

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