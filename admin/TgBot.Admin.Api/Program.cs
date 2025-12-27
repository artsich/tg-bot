using Microsoft.EntityFrameworkCore;
using TgBot.Admin.Api.Api;
using TgBot.Admin.Api.Startup;
using TgBot.Admin.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAdminApiServices(builder.Configuration);

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
	var db = scope.ServiceProvider.GetRequiredService<AdminDbContext>();
	await DatabaseInitializer.InitializeAsync(db);
}

app.UseAdminApiPipeline();

app.MapAdminApi();

app.Run();

