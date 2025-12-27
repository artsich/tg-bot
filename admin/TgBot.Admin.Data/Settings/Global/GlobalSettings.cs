namespace TgBot.Admin.Data.Settings.Global;

public sealed class GlobalSettings
{
	public string Id { get; set; } = GlobalSettingsRepository.GlobalId;

	public string? LlmModel { get; set; }

	public int? HistoryMaxLen { get; set; }

	public double? StupidCheck { get; set; }

	public string? DailyJokesTime { get; set; }

	public string? AiInstructions { get; set; }

	public string? StupidityInstructions { get; set; }

	public string? JokeInstructions { get; set; }
}

