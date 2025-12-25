using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TgBot.Admin.Api.Options;

public sealed class MongoOptionsValidator : IValidateOptions<MongoOptions>
{
	public ValidateOptionsResult Validate(string? name, MongoOptions options)
	{
		var errors = new List<string>();

		if (string.IsNullOrWhiteSpace(options.ConnectionString))
		{
			errors.Add("Mongo:ConnectionString must be provided.");
		}
		else
		{
			try
			{
				_ = MongoClientSettings.FromConnectionString(options.ConnectionString);
			}
			catch (Exception ex)
			{
				errors.Add($"Mongo:ConnectionString is invalid: {ex.Message}");
			}
		}

		if (string.IsNullOrWhiteSpace(options.Database))
		{
			errors.Add("Mongo:Database must be provided.");
		}

		return errors.Count == 0 ? ValidateOptionsResult.Success : ValidateOptionsResult.Fail(errors);
	}
}


