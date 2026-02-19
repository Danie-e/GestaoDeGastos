'use client'
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import type Usuario from "../lib/Interface/Usuario";

export default function Usuarios() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const rotaAPI = process.env.ROTA_API || 'https://localhost:7186'; // Fallback para desenvolvimento local

    // Filtrar dados com base no termo de busca
    const usuariosFiltrados = usuarios.filter(u =>
        Object.values(u).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const columns: GridColDef[] = [
        // { field: 'identificador', headerName: 'Id', width: 90 },
        { field: 'nome', headerName: 'Nome', flex: 2, minWidth: 200 },
        { field: 'idade', headerName: 'Idade', flex: 1, minWidth: 100, editable: false },
        {
            field: 'acoes',
            headerName: 'Ações',
            width: 210,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: (params: GridRenderCellParams<Usuario>) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        size="small"
                        variant="outlined"
                        onClick={(event) => {
                            event.stopPropagation();
                            router.push(`/usuarios/editar/${params.row.identificador}`);
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
                            excluirUsuario(params.row.identificador);
                        }}
                    >
                        Excluir
                    </Button>
                </Stack>
            ),
        },
    ];

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function carregarUsuarios() {
        const endpoint = new URL('/Pessoa', rotaAPI).toString();

        try {
            setLoading(true);
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`Erro ao carregar usuarios (${response.status})`);
            }

            const data = await response.json();
            setUsuarios(data);
            setError('');
        } catch (err: any) {
            if (err instanceof TypeError) {
                setError(`Falha de rede ao acessar ${endpoint}. Verifique se a API está online, CORS liberado para http://localhost:3000 e certificado HTTPS confiável.`);
            } else {
                setError(err.message || 'Erro ao carregar usuarios');
            }
            console.error('Erro:', err);
        } finally {
            setLoading(false);
        }
    }

    async function excluirUsuario(identificador: number) {
        const confirmou = window.confirm('Deseja realmente excluir este usuário?');
        if (!confirmou) return;

        const endpoint = new URL(`/Pessoa/${identificador}`, rotaAPI).toString();

        try {
            setLoading(true);
            const response = await fetch(endpoint, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error(`Erro ao excluir usuário (${response.status})`);
            }

            setUsuarios((prev) => prev.filter((u) => u.identificador !== identificador));
            setError('');
        } catch (err: any) {
            setError(err.message || 'Erro ao excluir usuário');
            console.error('Erro ao excluir:', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
            <div className="mx-auto my-6 sm:my-10 max-w-7xl gap-6 w-full px-4 sm:px-6 md:px-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold">Usuários</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/usuarios/novo"
                        sx={{ textTransform: 'none' }}
                    >
                        Adicionar Usuário
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
                            placeholder="Pesquisar Usuários por qualquer campo..."
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
                            rows={usuariosFiltrados}
                            columns={columns}
                            getRowClassName={() => 'cursor-pointer'}
                            getRowId={(row) => row.identificador}
                            onRowClick={(params) => router.push(`/usuarios/transacoes/${params.row.identificador}`)}
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