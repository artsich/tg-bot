using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Bson;
using MongoDB.Driver;

namespace TgChat.Admin.Api.Health;

public sealed class MongoPingHealthCheck(IMongoClient mongo) : IHealthCheck
{
	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			var adminDb = mongo.GetDatabase("admin");
			await adminDb.RunCommandAsync<BsonDocument>(new BsonDocument("ping", 1), cancellationToken: cancellationToken);
			return HealthCheckResult.Healthy("mongo_ok");
		}
		catch (Exception ex)
		{
			return new HealthCheckResult(context.Registration.FailureStatus, description: "mongo_unavailable", exception: ex);
		}
	}
}