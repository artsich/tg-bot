using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TgBot.Admin.Api.Api.Validation;
using TgBot.Admin.Api.Database;
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
			.AddOptions<PostgresOptions>()
			.Bind(configuration.GetSection(PostgresOptions.SectionName))
			.ValidateOnStart();

		services.AddSingleton<IValidateOptions<PostgresOptions>, PostgresOptionsValidator>();

		services.AddDbContext<AdminDbContext>((sp, options) =>
		{
			var postgresOptions = sp.GetRequiredService<IOptions<PostgresOptions>>().Value;
			options.UseNpgsql(postgresOptions.ConnectionString);
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
		services.AddScoped<GlobalSettingsRepository>();
		services.AddScoped<ChatSettingsRepository>();

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
			.AddCheck<PostgresPingHealthCheck>("postgres");

		return services;
	}

	private static IServiceCollection AddAdminApiSwagger(this IServiceCollection services)
	{
		services.AddEndpointsApiExplorer();
		services.AddSwaggerGen();
		return services;
	}
}


