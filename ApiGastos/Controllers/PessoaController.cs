using ApiGastos.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiGastos.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoaController : Controller
{
    private static List<Pessoa> Pessoas = new List<Pessoa>()
    {
         new(){
            DataNescimento = "28/09/2001",
            Nome = "Daniela",
            Identificador = 1,
         },
          new(){
            DataNescimento = "29/11/2010",
            Nome = "Edson",
            Identificador = 2,
         },
        new(){
            DataNescimento = "12/01/2003",
            Nome = "Rafaela",
            Identificador = 3,
         },
    };

    [HttpPost]
    public void AdicionarPessoa([FromBody] Pessoa pessoa)
    {
        Pessoas.Add(pessoa);
    }

    [HttpGet]
    public IEnumerable<Pessoa> ListarPessoas([FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return Pessoas.Skip(skip).Take(take);
    }

    [HttpGet("{id}")]
    public Pessoa RetornaPessoaPorId(int id)
    {
        return Pessoas.FirstOrDefault(p => p.Identificador.Equals(id))!;
    }
}
