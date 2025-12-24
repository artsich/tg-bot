namespace TgBot.Admin.Api.Api.Contracts;

public sealed record ChatSettings(
	long ChatId,
	bool StupidityCheck,
	bool JokeSubscribed,
	string JokeTopic
);

public sealed record ChatSettingsPut(
	bool? StupidityCheck,
	bool? JokeSubscribed,
	string? JokeTopic
);


