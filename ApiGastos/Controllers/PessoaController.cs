using ApiGastos.Data;
using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;
using Azure;
using Microsoft.AspNetCore.JsonPatch;
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


    [HttpGet]
    public IEnumerable<PessoaDTO> ListarPessoas([FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return _mapper.Map<List<PessoaDTO>>(_context.Pessoas.Skip(skip).Take(take));
    }

    [HttpGet("{id}")]
    public ActionResult<PessoaDTO> RetornaPessoaPorId(int id)
    {
        Pessoa pessoaEncontrada = _context.Pessoas.FirstOrDefault(p => p.Identificador.Equals(id));

        if (pessoaEncontrada == null)
            return NotFound();

        PessoaDTO pessoaDTO = _mapper.Map<PessoaDTO>(pessoaEncontrada);
        return Ok(pessoaDTO);
    }

    [HttpPost]
    public IActionResult AdicionarPessoa([FromBody] PessoaDTO pessoaDTO)
    {
        Pessoa pessoa = _mapper.Map<Pessoa>(pessoaDTO);
        _context.Pessoas.Add(pessoa);
        _context.SaveChanges();
        return CreatedAtAction(nameof(RetornaPessoaPorId), new { id = pessoa.Identificador }, _mapper.Map<PessoaDTO>(pessoa));
    }

    [HttpPut("{id}")]
    public IActionResult AtualizaPessoa(int id, [FromBody] PessoaDTO pessoaDTO)
    {
        Pessoa pessoaEncontrada = _context.Pessoas.FirstOrDefault(p => p.Identificador.Equals(id));
        if (pessoaEncontrada == null)
            return NotFound();

        _mapper.Map(pessoaDTO, pessoaEncontrada);
        _context.SaveChanges();

        return NoContent();
    }

    [HttpPatch("{id}")]
    public IActionResult AtualizaPessoaParcial(
    int id,
    [FromBody] JsonPatchDocument<PessoaDTO> patch)
    {
        var pessoaEncontrada = _context.Pessoas
            .FirstOrDefault(p => p.Identificador == id);

        if (pessoaEncontrada == null)
            return NotFound();

        var pessoaParaAtualizar = _mapper.Map<PessoaDTO>(pessoaEncontrada);

        patch.ApplyTo(pessoaParaAtualizar, ModelState);

        if (!TryValidateModel(pessoaParaAtualizar))
            return ValidationProblem(ModelState);

        _mapper.Map(pessoaParaAtualizar, pessoaEncontrada);
        _context.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult<Pessoa> DeletarPessoa(int id)
    {
        Pessoa pessoaEncontrada = _context.Pessoas.FirstOrDefault(p => p.Identificador.Equals(id));

        if (pessoaEncontrada != null)
            return Ok(pessoaEncontrada);

        _context.Remove(pessoaEncontrada);
        _context.SaveChanges();

        return NoContent();

    }
}
