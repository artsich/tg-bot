using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TgBot.Admin.Api.Settings.Global;

[BsonIgnoreExtraElements]
public sealed class GlobalSettingsDocument
{
	[BsonId]
	[BsonRepresentation(BsonType.String)]
	public string Id { get; set; } = "global";

	public string? LlmModel { get; set; }

	public int? HistoryMaxLen { get; set; }

	public double? StupidCheck { get; set; }

	public string? DailyJokesTime { get; set; }

	public string? AiInstructions { get; set; }

	public string? StupidityInstructions { get; set; }

	public string? JokeInstructions { get; set; }
}


