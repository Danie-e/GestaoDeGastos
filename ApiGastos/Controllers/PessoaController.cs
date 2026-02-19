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
    };

    [HttpPost]
    public void AdicionarPessoa([FromBody] Pessoa pessoa)
    {

        Pessoas.Add(pessoa);
    }

    [HttpGet]
    public IEnumerable<Pessoa> ListarPessoas()
    {
        return Pessoas;
    }

    [HttpGet("{id}")]
    public Pessoa RetornaPessoaPorId(int id)
    {
        return Pessoas.FirstOrDefault(p => p.Identificador.Equals(id))!;
    }
}
