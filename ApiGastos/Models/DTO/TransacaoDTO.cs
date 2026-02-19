using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models.DTO;

public class TransacaoDTO
{
    [Key]
    [Required]
    public int Identificador { get; set; }

    [StringLength(400, ErrorMessage = "A descrição da transação não pode exceder 400 caracteres.")]
    [Required(ErrorMessage = "A descrição é obrigatório.")]
    public string Descricao { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "O valor deve ser maior que 0.")]
    public double Valor { get; set; }

    public int TipoId { get; set; }

    public IEnumerable<int> ListaCategorias { get; set; } = new List<int>();

    public int PessoaIdentificador { get; set; }
}
