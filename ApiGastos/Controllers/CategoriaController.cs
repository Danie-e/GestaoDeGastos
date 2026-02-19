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
public class CategoriaController : Controller
{
    private Context _context;
    private IMapper _mapper;
    public CategoriaController(Context context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }


    [HttpGet]
    public IEnumerable<CategoriaDTO> ListarCategorias([FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return _mapper.Map<List<CategoriaDTO>>(
            _context.Categorias
                .Include(c => c.Finalidade)
                .Skip(skip)
                .Take(take));
    }

    [HttpGet("{id}")]
    public ActionResult<CategoriaDTO> RetornaCategoriaPorId(int id)
    {
        Categoria categoriaEncontrada = _context.Categorias
            .Include(c => c.Finalidade)
            .FirstOrDefault(p => p.Identificador.Equals(id));

        if (categoriaEncontrada == null)
            return NotFound();

        CategoriaDTO categoriaDTO = _mapper.Map<CategoriaDTO>(categoriaEncontrada);
        return Ok(categoriaDTO);
    }

    [HttpPost]
    public IActionResult AdicionarCategoria([FromBody] CategoriaDTO categoriaDTO)
    {
        Categoria categoria = _mapper.Map<Categoria>(categoriaDTO);
        categoria.Finalidade = _context.Finalidade.FirstOrDefault(f => f.Id.Equals(categoriaDTO.FinalidadeId));

        _context.Categorias.Add(categoria);
        _context.SaveChanges();
        return CreatedAtAction(nameof(RetornaCategoriaPorId), new { id = categoria.Identificador }, _mapper.Map<CategoriaDTO>(categoria));
    }

    [HttpPut("{id}")]
    public IActionResult AtualizaCategoria(int id, [FromBody] CategoriaDTO categoriaDTO)
    {
        Categoria categoriaEncontrada = _context.Categorias.FirstOrDefault(p => p.Identificador.Equals(id));
        if (categoriaEncontrada == null)
            return NotFound();

        categoriaEncontrada.Finalidade = _context.Finalidade.FirstOrDefault(f => f.Id.Equals(categoriaDTO.FinalidadeId));
        _mapper.Map(categoriaDTO, categoriaEncontrada);
        _context.SaveChanges();

        return Ok(categoriaEncontrada);
    }

    [HttpPatch("{id}")]
    public IActionResult AtualizaCategoriaParcial(int id, [FromBody] JsonPatchDocument<CategoriaDTO> patch)
    {
        var categoriaEncontrada = _context.Categorias
            .FirstOrDefault(p => p.Identificador == id);

        if (categoriaEncontrada == null)
            return NotFound();

        var categoriaParaAtualizar = _mapper.Map<CategoriaDTO>(categoriaEncontrada);

        patch.ApplyTo(categoriaParaAtualizar, ModelState);

        categoriaParaAtualizar.Identificador = id;

        if (!TryValidateModel(categoriaParaAtualizar))
            return ValidationProblem(ModelState);

        _mapper.Map(categoriaParaAtualizar, categoriaEncontrada);
        _context.SaveChanges();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult<Categoria> DeletarCategoria(int id)
    {
        Categoria categoriaEncontrada = _context.Categorias.FirstOrDefault(p => p.Identificador.Equals(id));

        if (categoriaEncontrada == null)
            return NotFound();

        _context.Remove(categoriaEncontrada);
        _context.SaveChanges();

        return NoContent();

    }
}
