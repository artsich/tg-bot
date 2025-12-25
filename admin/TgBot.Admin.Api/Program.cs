using TgBot.Admin.Api.Api;
using TgBot.Admin.Api.Startup;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAdminApiServices(builder.Configuration);

var app = builder.Build();

app.UseAdminApiPipeline();

app.MapAdminApi();

app.Run();

