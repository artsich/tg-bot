namespace TgBot.Admin.Data.Settings.Chats;

public sealed class ChatSettings
{
	public long ChatId { get; set; }

	public bool StupidityCheck { get; set; }

	public bool JokeSubscribed { get; set; }

	public string JokeTopic { get; set; } = string.Empty;
}

