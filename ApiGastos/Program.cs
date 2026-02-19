using ApiGastos.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//Realizando conexão  com o banco de dados SQL Server utilizando Entity Framework Core
builder.Services.AddDbContext<Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("GastosConnection")));

//Utilizando AutoMapper para mapear os objetos DTO para as entidades do banco de dados
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Add services to the container.

builder.Services.AddControllers();

// Configurando o Newtonsoft.Json para ignorar ciclos de referência, evitando erros de serialização
builder.Services
    .AddControllers()
    .AddNewtonsoftJson();


// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
