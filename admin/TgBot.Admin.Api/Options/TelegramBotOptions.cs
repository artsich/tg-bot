namespace TgBot.Admin.Api.Options;

public class TelegramBotOptions
{
	public const string SectionName = "TelegramBot";

	public string BotToken { get; set; } = string.Empty;
}

