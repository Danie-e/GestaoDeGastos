using ApiGastos.Data;
using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiGastos.Controllers;

[ApiController]
[Route("[controller]")]
public class TransacaoController : Controller
{
    private Context _context;
    private IMapper _mapper;
    public TransacaoController(Context context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }


    [HttpGet]
    public IEnumerable<TransacaoDTO> ListarTransacaos([FromQuery] int user, [FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return _mapper.Map<List<TransacaoDTO>>(
            _context.Transacoes
                .Where(t => t.Pessoa.Identificador.Equals(user))
                .Include(t => t.Tipo)
                .Include(p => p.Pessoa)
                .Include(c => c.Categoria)
                .Skip(skip)
                .Take(take));
    }

    [HttpGet("{id}")]
    public ActionResult<TransacaoDTO> RetornaTransacaoPorId(int id)
    {
        Transacao TransacaoEncontrada = _context.Transacoes
            .Include(t => t.Tipo)
            .Include(t => t.Pessoa)
            .Include(c => c.Categoria)
            .FirstOrDefault(p => p.Identificador.Equals(id));

        if (TransacaoEncontrada == null)
            return NotFound();

        TransacaoDTO TransacaoDTO = _mapper.Map<TransacaoDTO>(TransacaoEncontrada);
        return Ok(TransacaoDTO);
    }

    [HttpPost]
    public IActionResult AdicionarTransacao([FromBody] TransacaoDTO TransacaoDTO)
    {
        Transacao transacao = _mapper.Map<Transacao>(TransacaoDTO);
        transacao.Pessoa = _context.Pessoas.FirstOrDefault(p => p.Identificador.Equals(TransacaoDTO.PessoaIdentificador));
        transacao.Tipo = _context.Finalidade.FirstOrDefault(f => f.Id.Equals(TransacaoDTO.TipoId));
        transacao.Categoria = _context.Categorias.Where(c =>  TransacaoDTO.ListaCategorias.Contains(c.Identificador)).ToList();

        if (transacao.Pessoa.Idade < 18 && transacao.Tipo.Id != 1)
            return Unauthorized("Idade Insuficiente.");

        _context.Transacoes.Add(transacao);
        _context.SaveChanges();
        return CreatedAtAction(nameof(RetornaTransacaoPorId), new { id = transacao.Identificador }, _mapper.Map<TransacaoDTO>(transacao));
    }
}
