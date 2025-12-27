using Microsoft.Extensions.Options;

namespace TgBot.Admin.Api.Options;

public sealed class PostgresOptionsValidator : IValidateOptions<PostgresOptions>
{
	public ValidateOptionsResult Validate(string? name, PostgresOptions options)
	{
		var errors = new List<string>();

		if (string.IsNullOrWhiteSpace(options.Host))
		{
			errors.Add("Postgres:Host must be provided.");
		}

		if (string.IsNullOrWhiteSpace(options.User))
		{
			errors.Add("Postgres:User must be provided.");
		}

		if (string.IsNullOrWhiteSpace(options.Password))
		{
			errors.Add("Postgres:Password must be provided.");
		}

		if (string.IsNullOrWhiteSpace(options.Database))
		{
			errors.Add("Postgres:Database must be provided.");
		}

		return errors.Count == 0 ? ValidateOptionsResult.Success : ValidateOptionsResult.Fail(errors);
	}
}

