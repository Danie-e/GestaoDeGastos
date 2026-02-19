using ApiGastos.Data;
using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace ApiGastos.Controllers;

[ApiController]
[Route("[controller]")]
public class PessoaController : Controller
{
    private Context _context;
    private IMapper _mapper;
    public PessoaController(Context context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    public IActionResult AdicionarPessoa([FromBody] PessoaDTO pessoaDTO)
    {
        Pessoa pessoa = _mapper.Map<Pessoa>(pessoaDTO);
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
