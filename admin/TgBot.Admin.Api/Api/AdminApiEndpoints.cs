using Microsoft.AspNetCore.Diagnostics.HealthChecks;

namespace TgBot.Admin.Api.Api;

public static class AdminApiEndpoints
{
	public static IEndpointRouteBuilder MapAdminApi(this IEndpointRouteBuilder endpoints)
	{
		var api = endpoints.MapGroup("/api");

		api.MapHealthChecks("/health", new HealthCheckOptions
		{
			AllowCachingResponses = false
		});

		api.MapGlobalSettingsApi();
		api.MapChatSettingsApi();

		return endpoints;
	}
}