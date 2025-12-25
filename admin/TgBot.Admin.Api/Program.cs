using FluentValidation;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TgBot.Admin.Api.Api;
using TgBot.Admin.Api.Health;
using TgBot.Admin.Api.Options;
using TgBot.Admin.Api.Settings.Chats;
using TgBot.Admin.Api.Settings.Global;

var builder = WebApplication.CreateBuilder(args);

builder.Services
	.AddOptions<MongoOptions>()
	.Bind(builder.Configuration.GetSection(MongoOptions.SectionName))
	.ValidateOnStart();

builder.Services.AddSingleton<IValidateOptions<MongoOptions>, MongoOptionsValidator>();

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

builder.Services.AddSingleton<IMongoClient>(sp =>
{
	var mongoOptions = sp.GetRequiredService<IOptions<MongoOptions>>().Value;

	var settings = MongoClientSettings.FromConnectionString(mongoOptions.ConnectionString);
	settings.ServerSelectionTimeout = TimeSpan.FromSeconds(2);
	settings.ConnectTimeout = TimeSpan.FromSeconds(2);
	settings.SocketTimeout = TimeSpan.FromSeconds(2);

	return new MongoClient(settings);
});

builder.Services.AddSingleton<IMongoDatabase>(sp =>
{
	var mongoOptions = sp.GetRequiredService<IOptions<MongoOptions>>().Value;

	return sp.GetRequiredService<IMongoClient>().GetDatabase(mongoOptions.Database);
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

