'use client'
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import type Categoria from "../lib/Interface/Categoria";
import type Finalidade from "../lib/Interface/Finalidade";

export default function Categorias() {
    const router = useRouter();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [finalidades, setFinalidades] = useState<Finalidade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local

    function obterNomeFinalidade(finalidadeId: number) {
        const finalidadeEncontrada = finalidades.find((f) => {
            const id = f.id ?? f.Id;
            return id === finalidadeId;
        });

        return finalidadeEncontrada?.nome ?? finalidadeEncontrada?.Nome ?? `ID ${finalidadeId}`;
    }

    // Filtrar dados com base no termo de busca
    const categoriaFiltrados = categorias.filter(c =>
        Object.values(c).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const columns: GridColDef[] = [
        // { field: 'identificador', headerName: 'Id', width: 90 },
        { field: 'descricao', headerName: 'Descrição', flex: 2, minWidth: 200 },
        {
            field: 'finalidadeId',
            headerName: 'Finalidade',
            flex: 1,
            minWidth: 160,
            editable: false,
            valueGetter: (value) => {
                if (typeof value === 'number')
                    return obterNomeFinalidade(value);

                return '-';
            },
        },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 210,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<Categoria>) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/categorias/editar/${params.row.identificador}`);
                        }}
                    >
                        Editar
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={(event) => {
                            event.stopPropagation();
                            excluirCategoria(params.row.identificador);
                        }}
                    >
                        Excluir
                    </Button>
                </Stack>
            ),
        },
    ];

    useEffect(() => {
        carregarCategorias();
    }, []);

    async function carregarCategorias() {
        const endpointCategorias = new URL('/Categoria', rotaAPI).toString();
        const endpointFinalidades = new URL('/Finalidade', rotaAPI).toString();

        try {
            setLoading(true);
            const [responseCategorias, responseFinalidades] = await Promise.all([
                fetch(endpointCategorias),
                fetch(endpointFinalidades),
            ]);

            if (!responseCategorias.ok) {
                throw new Error(`Erro ao carregar categorias (${responseCategorias.status})`);
            }

            if (!responseFinalidades.ok) {
                throw new Error(`Erro ao carregar finalidades (${responseFinalidades.status})`);
            }

            const [dataCategorias, dataFinalidades] = await Promise.all([
                responseCategorias.json(),
                responseFinalidades.json(),
            ]);

            setCategorias(dataCategorias);
            setFinalidades(dataFinalidades);
            setError('');
        } catch (err: any) {
            if (err instanceof TypeError) {
                setError(`Falha de rede ao acessar a API. Verifique se as rotas /Categoria e /Finalidade estão online, CORS liberado para http://localhost:3000 e certificado HTTPS confiável.`);
            } else {
                setError(err.message || 'Erro ao carregar categorias');
            }
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    }

    async function excluirCategoria(identificador: number) {
        const confirmou = window.confirm('Deseja realmente excluir esta categoria?');
        if (!confirmou) return;

        const endpoint = new URL(`/Categoria/${identificador}`, rotaAPI).toString();

        try {
            setLoading(true);
            const response = await fetch(endpoint, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`Erro ao excluir categoria (${response.status})`);
            }

            setCategorias((prev) => prev.filter((u) => u.identificador !== identificador));
            setError('');
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir categoria');
            console.error('Erro ao excluir:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-7xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Categorias</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/categorias/novo"
                        sx={{ textTransform: 'none' }}
                    >
                        Adicionar Categoria
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
                            placeholder="Pesquisar categoria por qualquer campo..."
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
                            rows={categoriaFiltrados}
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