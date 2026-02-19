using ApiGastos.Data;
using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace ApiGastos.Controllers;

[ApiController]
[Route("[controller]")]
public class FinalidadeController : Controller
{
    private Context _context;
    private IMapper _mapper;
    public FinalidadeController(Context context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }


    [HttpGet]
    public IEnumerable<Finalidade> ListarCategorias([FromQuery] int skip = 0, [FromQuery] int take = 15)
    {
        return _context.Finalidade;
    }

    [HttpGet("{id}")]
    public ActionResult<CategoriaDTO> RetornaCategoriaPorId(int id)
    {
        Finalidade finalidadeEncontrada = _context.Finalidade.FirstOrDefault(f => f.Id.Equals(id));

        if (finalidadeEncontrada == null)
            return NotFound();

        return Ok(finalidadeEncontrada);
    }

}
