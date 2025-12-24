using FluentValidation;
using MongoDB.Driver;
using TgBot.Admin.Api.Api;
using TgBot.Admin.Api.Health;
using TgBot.Admin.Api.Settings.Chats;
using TgBot.Admin.Api.Settings.Global;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
	{
		policy
			.AllowAnyOrigin()
			.AllowAnyHeader()
			.AllowAnyMethod();
	});
});

builder.Services.AddSingleton<IMongoClient>(_ =>
{
	var conn = builder.Configuration.GetValue<string>("Mongo:ConnectionString")
		?? builder.Configuration.GetValue<string>("Mongo__ConnectionString")
		?? "mongodb://localhost:27017";

	var settings = MongoClientSettings.FromConnectionString(conn);
	settings.ServerSelectionTimeout = TimeSpan.FromSeconds(2);
	settings.ConnectTimeout = TimeSpan.FromSeconds(2);
	settings.SocketTimeout = TimeSpan.FromSeconds(2);

	return new MongoClient(settings);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
	var dbName = builder.Configuration.GetValue<string>("Mongo:Database")
		?? builder.Configuration.GetValue<string>("Mongo__Database")
	?? "tgbot";

	return sp.GetRequiredService<IMongoClient>().GetDatabase(dbName);
});

builder.Services.AddSingleton<GlobalSettingsRepository>();
builder.Services.AddSingleton<ChatSettingsRepository>();

builder.Services.AddValidatorsFromAssemblyContaining<GlobalSettingsPatchValidator>(ServiceLifetime.Transient);

builder.Services
	.AddHealthChecks()
	.AddCheck<MongoPingHealthCheck>("mongo");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();
if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.MapAdminApi();

app.Run();

