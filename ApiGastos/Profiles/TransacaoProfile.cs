using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;

namespace ApiGastos.Profiles;

public class TransacaoProfile : Profile
{
    public TransacaoProfile()
    {
        CreateMap<TransacaoDTO, Transacao>()
            .ForMember(dest => dest.Identificador, opt => opt.Ignore())
            .ForMember(dest => dest.Tipo, opt => opt.Ignore())
            .ForMember(dest => dest.Pessoa, opt => opt.Ignore())
            .ForMember(dest => dest.Categoria, opt => opt.Ignore());

        CreateMap<Transacao, TransacaoDTO>()
            .ForMember(dest => dest.TipoId, opt => opt.MapFrom(src => src.Tipo != null ? src.Tipo.Id : 0))
            .ForMember(dest => dest.PessoaIdentificador, opt => opt.MapFrom(src => src.Pessoa != null ? src.Pessoa.Identificador : 0))
            .ForMember(dest => dest.ListaCategorias, opt => opt.MapFrom(src => src.Categoria != null
                ? src.Categoria.Select(c => c.Identificador)
                : Enumerable.Empty<int>()))
            .AfterMap((src, dest) => dest.ListaCategorias ??= new List<int>());
    }
}
