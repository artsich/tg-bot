using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TgChat.Admin.Api.Settings.Chats;

[BsonIgnoreExtraElements]
public sealed class ChatSettingsDocument
{
	[BsonId]
	[BsonRepresentation(BsonType.Int64)]
	public long ChatId { get; set; }

	public bool StupidityCheck { get; set; }

	public bool JokeSubscribed { get; set; }

	public string JokeTopic { get; set; } = string.Empty;
}


