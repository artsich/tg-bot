namespace TgChat.Admin.Api.Api.Contracts;

public sealed record GlobalSettings(
	string LlmModel,
	int HistoryMaxLen,
	double StupidCheck,
	string DailyJokesTime,
	string AiInstructions,
	string StupidityInstructions,
	string JokeInstructions
);

public sealed record GlobalSettingsPatch(
	string? LlmModel,
	int? HistoryMaxLen,
	double? StupidCheck,
	string? DailyJokesTime,
	string? AiInstructions,
	string? StupidityInstructions,
	string? JokeInstructions
);


