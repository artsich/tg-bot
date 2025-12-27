namespace TgBot.Admin.Api.Options;

public sealed class PostgresOptions
{
	public const string SectionName = "Postgres";

	public string Host { get; init; } = string.Empty;

	public string User { get; init; } = string.Empty;

	public string Password { get; init; } = string.Empty;

	public string Database { get; init; } = string.Empty;

	public string ConnectionString => $"Host={Host};Username={User};Password={Password};Database={Database}";
}

