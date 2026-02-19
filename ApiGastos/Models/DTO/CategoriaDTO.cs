using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models.DTO;

public class CategoriaDTO
{
    [Required]
    public int Identificador { get; set; }

    [StringLength(400, ErrorMessage = "A descrição da categoria não pode exceder 400 caracteres.")]
    public string Descricao { get; set; }

    public int FinalidadeId { get; set; }
}
