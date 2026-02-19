using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models;

public class Categoria
{
    [Key]
    [Required]
    public int Identificador { get; set; }

    [MaxLength(400, ErrorMessage = "A descrição da categoria não pode exceder 400 caracteres.")]
    public string Descricao { get; set; }

    public Finalidade Finalidade { get; set; }
    public IEnumerable<Transacao> Transacao { get; set; }

}
