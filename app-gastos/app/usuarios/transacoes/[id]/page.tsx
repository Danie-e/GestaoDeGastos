'use client'
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Transacoes from "@/lib/Interface/Transacoes";
import Categoria from "@/lib/Interface/Categoria";

export default function PageTransacoes() {
    const router = useRouter();
    const params = useParams();

    const [transacoes, setTransacoes] = useState<Transacoes[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const id = params.id as string;
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local

    // Filtrar dados com base no termo de busca
    const transacoesFiltradas = transacoes.filter(u =>
        Object.values(u).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    function formatarCategorias(value: unknown): string {
        if (!value) return '-';

        const ids: number[] = Array.isArray(value)
            ? value.map((item) => Number(item)).filter((id) => !Number.isNaN(id))
            : String(value).split(',').map((item) => Number(item.trim())).filter((id) => !Number.isNaN(id));

        if (ids.length === 0) return '-';

        const nomes = ids
            .map((idCategoria) => categorias.find((c) => c.identificador === idCategoria)?.descricao)
            .filter((nome): nome is string => Boolean(nome));

        return nomes.length > 0 ? nomes.join(', ') : '-';
    }

    const columns: GridColDef[] = [
        // { field: 'identificador', headerName: 'Id', width: 90 },
        { field: 'descricao', headerName: 'Descrição', flex: 2, minWidth: 200 },
        { field: 'valor', headerName: 'Valor', flex: 1, minWidth: 100 },
        {
            field: 'tipoId', headerName: 'Tipo', flex: 1, minWidth: 100,
            valueFormatter: (value) => value === 1 ? 'Despesa' : value === 2 ? 'Receita' : String(value)
        },
        {
            field: 'listaCategorias', headerName: 'Categorias', flex: 1, minWidth: 100,
            valueFormatter: (value) => formatarCategorias(value),
        },
    ];

    useEffect(() => {
        carregarTransacoes();
    }, []);

    async function carregarTransacoes() {
        const endpointTransacao = new URL(`/Transacao?user=${id}`, rotaAPI).toString();
        const endpointCategorias = new URL(`/Categoria`, rotaAPI).toString();

        try {
            setLoading(true);
            const response = await fetch(endpointTransacao);
            if (!response.ok) {
                throw new Error(`Erro ao carregar transacões (${response.status})`);
            }

            const data = await response.json();
            setTransacoes(data);
            setError('');
        } catch (err: any) {
            if (err instanceof TypeError) {
                setError(`Falha de rede ao acessar ${endpointTransacao}. Verifique se a API está online, CORS liberado para http://localhost:3000 e certificado HTTPS confiável.`);
            } else {
                setError(err.message || 'Erro ao carregar transações');
            }
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }

        try {
            const response = await fetch(endpointCategorias);
            if (!response.ok) {
                throw new Error(`Erro ao carregar categorias (${response.status})`);
            }

            const data = await response.json();
            setCategorias(data);
            setError('');
        } catch (err: any) {
            if (err instanceof TypeError) {
                setError(`Falha de rede ao acessar ${endpointCategorias}. Verifique se a API está online, CORS liberado para http://localhost:3000 e certificado HTTPS confiável.`);
            } else {
                setError(err.message || 'Erro ao carregar categorias');
            }
            console.error('Erro:', err);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-7xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Transações</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`${params.id}/novo`}
                        sx={{ textTransform: 'none' }}
                    >
                        Adicionar Transação
                    </Button>
                </div>

                {error && (
                    <div className="p-4 mb-4 rounded-md bg-red-100 border border-red-400 text-red-700">
                        <p className="font-semibold">{error}</p>
                    </div>
                )}
                {!loading && (
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Pesquisar transações por qualquer campo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{
                                bgcolor: 'white',
                                borderRadius: 1,
                            }}
                        />
                    </Box>
                )}
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ height: '90%', width: '100%', bgcolor: 'white', borderRadius: 1 }}>
                        <DataGrid
                            rows={transacoesFiltradas}
                            columns={columns}
                            getRowClassName={() => 'cursor-pointer'}
                            getRowId={(row) => row.identificador}
                            disableRowSelectionOnClick
                            slots={{ toolbar: GridToolbar }}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 15 },
                                },
                            }}
                            pageSizeOptions={[5, 10, 15, 25, 50]}
                            sx={{
                                border: 1,
                                borderColor: 'grey.300',
                                '& .MuiDataGrid-cell:hover': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    </Box>
                )}
            </div>
        </div>
    )
}