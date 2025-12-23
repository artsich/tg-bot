using MongoDB.Driver;
using TgChat.Admin.Api.Health;
using TgChat.Admin.Api.Api;

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

builder.Services
	.AddHealthChecks()
	.AddCheck<MongoPingHealthCheck>("mongo");

var app = builder.Build();

app.UseCors();

app.MapAdminApi();

app.Run();

