using ApiGastos.Data;
using ApiGastos.Models;
using Microsoft.AspNetCore.Mvc;

namespace ApiGastos.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoaController : Controller
{
    private Context _context;
    public PessoaController(Context context)
    {
        _context = context;
    }

    [HttpPost]
    public IActionResult AdicionarPessoa([FromBody] Pessoa pessoa)
    {
        _context.Pessoas.Add(pessoa);
        _context.SaveChanges();
        return CreatedAtAction(nameof(RetornaPessoaPorId), new { id = pessoa.Identificador }, pessoa);
    }

    [HttpGet]
    public IEnumerable<Pessoa> ListarPessoas([FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return _context.Pessoas.Skip(skip).Take(take);
    }

    [HttpGet("{id}")]
    public ActionResult<Pessoa> RetornaPessoaPorId(int id)
    {
        Pessoa pessoaEncontrada = _context.Pessoas.FirstOrDefault(p => p.Identificador.Equals(id));

        if (pessoaEncontrada != null)
            return Ok(pessoaEncontrada);
        else
            return NotFound();

    }
}
