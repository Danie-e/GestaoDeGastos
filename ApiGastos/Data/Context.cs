using ApiGastos.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiGastos.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> opt) : base(opt)
        {
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
        public DbSet<Finalidade> Finalidade { get; set; }
    }
}
