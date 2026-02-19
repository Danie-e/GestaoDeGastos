using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiGastos.Migrations
{
    /// <inheritdoc />
    public partial class AjusteTabelaTransacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categorias_Transacoes_TransacaoIdentificador",
                table: "Categorias");

            migrationBuilder.DropIndex(
                name: "IX_Categorias_TransacaoIdentificador",
                table: "Categorias");

            migrationBuilder.DropColumn(
                name: "TransacaoIdentificador",
                table: "Categorias");

            migrationBuilder.CreateTable(
                name: "CategoriaTransacao",
                columns: table => new
                {
                    CategoriaIdentificador = table.Column<int>(type: "int", nullable: false),
                    TransacaoIdentificador = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoriaTransacao", x => new { x.CategoriaIdentificador, x.TransacaoIdentificador });
                    table.ForeignKey(
                        name: "FK_CategoriaTransacao_Categorias_CategoriaIdentificador",
                        column: x => x.CategoriaIdentificador,
                        principalTable: "Categorias",
                        principalColumn: "Identificador",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoriaTransacao_Transacoes_TransacaoIdentificador",
                        column: x => x.TransacaoIdentificador,
                        principalTable: "Transacoes",
                        principalColumn: "Identificador",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoriaTransacao_TransacaoIdentificador",
                table: "CategoriaTransacao",
                column: "TransacaoIdentificador");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoriaTransacao");

            migrationBuilder.AddColumn<int>(
                name: "TransacaoIdentificador",
                table: "Categorias",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categorias_TransacaoIdentificador",
                table: "Categorias",
                column: "TransacaoIdentificador");

            migrationBuilder.AddForeignKey(
                name: "FK_Categorias_Transacoes_TransacaoIdentificador",
                table: "Categorias",
                column: "TransacaoIdentificador",
                principalTable: "Transacoes",
                principalColumn: "Identificador");
        }
    }
}
