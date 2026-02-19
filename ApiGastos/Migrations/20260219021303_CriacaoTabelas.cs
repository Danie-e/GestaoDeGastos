using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiGastos.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoTabelas : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Finalidade",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Finalidade", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pessoas",
                columns: table => new
                {
                    Identificador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nome = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DataNescimento = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pessoas", x => x.Identificador);
                });

            migrationBuilder.CreateTable(
                name: "Transacoes",
                columns: table => new
                {
                    Identificador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descricao = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    Valor = table.Column<double>(type: "float", nullable: false),
                    TipoId = table.Column<int>(type: "int", nullable: false),
                    PessoaIdentificador = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transacoes", x => x.Identificador);
                    table.ForeignKey(
                        name: "FK_Transacoes_Finalidade_TipoId",
                        column: x => x.TipoId,
                        principalTable: "Finalidade",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Transacoes_Pessoas_PessoaIdentificador",
                        column: x => x.PessoaIdentificador,
                        principalTable: "Pessoas",
                        principalColumn: "Identificador",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Categorias",
                columns: table => new
                {
                    Identificador = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Descricao = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    FinalidadeId = table.Column<int>(type: "int", nullable: false),
                    TransacaoIdentificador = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categorias", x => x.Identificador);
                    table.ForeignKey(
                        name: "FK_Categorias_Finalidade_FinalidadeId",
                        column: x => x.FinalidadeId,
                        principalTable: "Finalidade",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Categorias_Transacoes_TransacaoIdentificador",
                        column: x => x.TransacaoIdentificador,
                        principalTable: "Transacoes",
                        principalColumn: "Identificador");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_FinalidadeId",
                table: "Categorias",
                column: "FinalidadeId");

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_TransacaoIdentificador",
                table: "Categorias",
                column: "TransacaoIdentificador");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_PessoaIdentificador",
                table: "Transacoes",
                column: "PessoaIdentificador");

            migrationBuilder.CreateIndex(
                name: "IX_Transacoes_TipoId",
                table: "Transacoes",
                column: "TipoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Categorias");

            migrationBuilder.DropTable(
                name: "Transacoes");

            migrationBuilder.DropTable(
                name: "Finalidade");

            migrationBuilder.DropTable(
                name: "Pessoas");
        }
    }
}
