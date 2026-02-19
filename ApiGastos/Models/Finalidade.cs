using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models;

public class Finalidade
{
    [Key]
    public int Id { get; set; }

    [Required]
    public string Nome { get; set; }
}
