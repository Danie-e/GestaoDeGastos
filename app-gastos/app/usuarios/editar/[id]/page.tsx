'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Usuario from "@//lib/Interface/Usuario";

export default function NovoUsuario() {
    const router = useRouter();
    const params = useParams();

    const [dataNascimento, setDataNascimento] = useState('');
    const [nome, setNome] = useState('');

    const [mensagem, setMensagem] = useState('');
    const [tipoMensagem, setTipoMensagem] = useState<'sucesso' | 'erro' | ''>('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local
    const id = params.id as string;


    function limparFormulario() {
        setDataNascimento('');
        setNome('');
    }


    useEffect(() => {
        async function buscarSindicalizado() {
            try {
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

                setDataNascimento(data.dataNascimento);
                setNome(data.nome);

            } catch (error: any) {
                setTipoMensagem('erro');
                setMensagem(error.message || 'Erro ao carregar dados da pessoa');
            }
            //  finally {
            //     setLoading(false);
            // }
        }

        if (id) {
            buscarSindicalizado();
        }
    }, [id]);

    async function salvarPessoa(e: React.FormEvent) {
        const endpoint = new URL(`/Pessoa/${id}`, rotaAPI).toString();
        e.preventDefault();
        setMensagem('');
        setTipoMensagem('');

        const body = {
            dataNascimento,
            nome,
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
                setMensagem('Pessoa atualizada com sucesso! Redirecionando...');

                // Redirecionar para página de endereço e telefone
                setTimeout(() => {
                    router.push(`/usuarios`);
                }, 1500);
            } else {
                const data = await response.json();

                setTipoMensagem('erro');
                setMensagem(data.message || data.error || 'Erro ao atualizar Pessoa');
            }
        } catch (error: any) {
            setTipoMensagem('erro');
            setMensagem(error.message || 'Erro ao atualizar Pessoa');
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-6xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <h1 className="text-2xl sm:text-3xl font-bold mb-6">Atualizar Pessoa</h1>

                {mensagem && (
                    <div className={`p-4 mb-4 rounded-md ${tipoMensagem === 'sucesso'
                        ? 'bg-green-100 border border-green-400 text-green-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
                        }`}>
                        <p className="font-semibold">{mensagem}</p>
                    </div>
                )}

                <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={salvarPessoa}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Nome: <span className="text-red-500">*</span></span>
                            <input
                                type="text"
                                placeholder="Nome"
                                maxLength={255}
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </label>
                        <label className="flex flex-col col-span-2">
                            <span className="font-semibold text-sm mb-2">Data de Nascimento: <span className="text-red-500">*</span></span>
                            <input
                                type="date"
                                placeholder="Data de Nascimento"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
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