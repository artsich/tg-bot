using Microsoft.Extensions.Diagnostics.HealthChecks;
using TgBot.Admin.Api.Database;

namespace TgBot.Admin.Api.Health;

public sealed class PostgresPingHealthCheck(AdminDbContext db) : IHealthCheck
{
	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			var canConnect = await db.Database.CanConnectAsync(cancellationToken);
			return canConnect
				? HealthCheckResult.Healthy("postgres_ok")
				: new HealthCheckResult(context.Registration.FailureStatus, description: "postgres_unavailable");
		}
		catch (Exception ex)
		{
			return new HealthCheckResult(context.Registration.FailureStatus, description: "postgres_unavailable", exception: ex);
		}
	}
}