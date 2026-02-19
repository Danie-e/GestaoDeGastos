using ApiGastos.Models;
using ApiGastos.Models.DTO;
using AutoMapper;

namespace ApiGastos.Profiles;

public class PessoaProfile : Profile
{
    public PessoaProfile()
    {
        CreateMap<PessoaDTO, Pessoa>();
        CreateMap<Pessoa, PessoaDTO>();
    }
}
