using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;

namespace ApiGastos.Profiles;

public class CategoriaProfile : Profile
{
    public CategoriaProfile()
    {
        CreateMap<CategoriaDTO, Categoria>()
            .ForMember(dest => dest.Identificador, opt => opt.Ignore());
        CreateMap<Categoria, CategoriaDTO>()
            .ForMember(dest => dest.FinalidadeId, opt => opt.MapFrom(src => src.Finalidade != null ? src.Finalidade.Id : 0));
    }
}
