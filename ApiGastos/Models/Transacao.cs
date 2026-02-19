using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models;

public class Transacao
{
    [Key]
    [Required]
    public int Identificador { get; set; }

    [MaxLength(400, ErrorMessage = "A descrição da transação não pode exceder 400 caracteres.")]
    [Required(ErrorMessage = "A descrição é obrigatório.")]
    public string Descricao { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "O valor deve ser maior que 0.")]
    [Required(ErrorMessage = "O valor é obrigatório.")]
    public double Valor { get; set; }

    [Required(ErrorMessage = "O tipo da transação é obrigatorio.")]
    public Finalidade Tipo { get; set; }

    public ICollection<Categoria> Categoria { get; set; }

    public Pessoa Pessoa { get; set; }
}
