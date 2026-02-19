using System.ComponentModel.DataAnnotations;

namespace ApiGastos.Models;

public class Pessoa
{
    [Key]
    [Required]
    public int Identificador { get; set; }

    [Required(ErrorMessage = "O nome da pessoa é obrigatorio.")]
    [MaxLength(200, ErrorMessage = "O nome da pessoa não pode exceder 200 caracteres.")]
    public string Nome { get; set; }

    [Required]
    public string DataNascimento { get; set; }

    public int Idade
    {
        get
        {
            DateOnly dataNascimento = DateOnly.Parse(DataNascimento);

            int idade = DateTime.Now.Year - dataNascimento.Year;

            if ((DateTime.Now.Day < dataNascimento.Day) && DateTime.Now.Month < dataNascimento.Month)
                idade--;

            return idade;
        }
    }

    public ICollection<Transacao>? Transacao { get; set; }
}
