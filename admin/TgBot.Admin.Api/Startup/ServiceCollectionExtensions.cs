using FluentValidation;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TgBot.Admin.Api.Health;
using TgBot.Admin.Api.Options;
using TgBot.Admin.Api.Settings.Chats;
using TgBot.Admin.Api.Settings.Global;

namespace TgBot.Admin.Api.Startup;

public static class ServiceCollectionExtensions
{
	public static IServiceCollection AddAdminApiServices(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddAdminApiCors();
		services.AddDatabase(configuration);
		services.AddAdminApiSettings();
		services.AddAdminApiValidation();
		services.AddAdminApiHealthChecks();
		services.AddAdminApiSwagger();

		return services;
	}

	private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
	{
		services
			.AddOptions<MongoOptions>()
			.Bind(configuration.GetSection(MongoOptions.SectionName))
			.ValidateOnStart();

		services.AddSingleton<IValidateOptions<MongoOptions>, MongoOptionsValidator>();

		services.AddSingleton<IMongoClient>(sp =>
		{
			var mongoOptions = sp.GetRequiredService<IOptions<MongoOptions>>().Value;

			var settings = MongoClientSettings.FromConnectionString(mongoOptions.ConnectionString);
			settings.ServerSelectionTimeout = TimeSpan.FromSeconds(2);
			settings.ConnectTimeout = TimeSpan.FromSeconds(2);
			settings.SocketTimeout = TimeSpan.FromSeconds(2);

			return new MongoClient(settings);
		});

		services.AddSingleton<IMongoDatabase>(sp =>
		{
			var mongoOptions = sp.GetRequiredService<IOptions<MongoOptions>>().Value;
			return sp.GetRequiredService<IMongoClient>().GetDatabase(mongoOptions.Database);
		});

		return services;
	}

	private static IServiceCollection AddAdminApiCors(this IServiceCollection services)
	{
		services.AddCors(options =>
		{
			options.AddDefaultPolicy(policy =>
			{
				policy
					.AllowAnyOrigin()
					.AllowAnyHeader()
					.AllowAnyMethod();
			});
		});

		return services;
	}

	private static IServiceCollection AddAdminApiSettings(this IServiceCollection services)
	{
		services.AddSingleton<GlobalSettingsRepository>();
		services.AddSingleton<ChatSettingsRepository>();

		return services;
	}

	private static IServiceCollection AddAdminApiValidation(this IServiceCollection services)
	{
		services.AddValidatorsFromAssemblyContaining<GlobalSettingsPatchValidator>(ServiceLifetime.Transient);
		return services;
	}

	private static IServiceCollection AddAdminApiHealthChecks(this IServiceCollection services)
	{
		services
			.AddHealthChecks()
			.AddCheck<MongoPingHealthCheck>("mongo");

		return services;
	}

	private static IServiceCollection AddAdminApiSwagger(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();
		services.AddSwaggerGen();
		return services;
	}
}


