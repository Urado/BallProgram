using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using BallProgramServer.Hubs;
using BallProgramServer.PlaylistDomain.Aplication.Interfaces;
using BallProgramServer.PlaylistDomain.Aplication.Services;
using BallProgramServer.PlaylistDomain.Domain.Entities;
using BallProgramServer.PlaylistDomain.Domain.Repositories;
using BallProgramServer.PlaylistDomain.Infrastructure.Persistence;
using BallProgramServer.PlaylistDomain.Infrastructure.Persistence.Repositories;
using BallProgramServer.PlaylistDomain.Infrastructure.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:3000"); // React-клиент
    });
});

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();
builder.Services.AddScoped<IGuestPlaylistService, PlaylistService>();
builder.Services.AddScoped<IPlayerPlaylistService, PlaylistService>();
builder.Services.AddScoped<IPlaylistStreamingService, PlaylistStreamingService>();
builder.Services.AddScoped<IPlaylistSubscriptionService, PlaylistSubscriptionService>();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.TypeInfoResolverChain.Insert(0, new DefaultJsonTypeInfoResolver
        {
            Modifiers =
            {
                typeInfo =>
                {
                    if (typeInfo.Type == typeof(BaseNode))
                    {
                        typeInfo.PolymorphismOptions = new JsonPolymorphismOptions
                        {
                            TypeDiscriminatorPropertyName = "$type",
                            IgnoreUnrecognizedTypeDiscriminators = true,
                            UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FallBackToBaseType,
                            DerivedTypes =
                            {
                                new JsonDerivedType(typeof(GroupNode), "group"),
                                new JsonDerivedType(typeof(TrackNode), "track"),
                                // сюда добавляй другие наследники
                            }
                        };
                    }
                }
            }
        });
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Playlist API", Version = "v1" });
});


builder.Services.AddDbContext<PlaylistDbContext>(optionsBuilder =>
{
    optionsBuilder.UseNpgsql(builder.Configuration["DbConnectionString"]);
});
builder.Services.AddSignalR();


var app = builder.Build();

app.UseRouting();
app.UseCors();
app.MapHub<PlayerHub>("/hubs/player");
app.MapHub<GuestHub>("/hubs/guest");  



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Playlist API V1");
    });
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
