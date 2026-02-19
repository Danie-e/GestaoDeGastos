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
    public string DataNescimento { get; set; }

    public int Idade
    {
        get
        {
            string[] valores = DataNescimento.Split("/");
            int dia = int.Parse(valores[0]);
            int mes = int.Parse(valores[1]);
            int ano = int.Parse(valores[2]);

            int idade = DateTime.Now.Year - new DateOnly(ano, mes, dia).Year;

            if ((DateTime.Now.Day < dia) && DateTime.Now.Month < mes)
                idade--;

            return idade;
        }
    }

    public ICollection<Transacao> Transacao { get; set; }
}
