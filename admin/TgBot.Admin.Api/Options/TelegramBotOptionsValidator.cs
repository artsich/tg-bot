using Microsoft.Extensions.Options;

namespace TgBot.Admin.Api.Options;

public class TelegramBotOptionsValidator : IValidateOptions<TelegramBotOptions>
{
	public ValidateOptionsResult Validate(string? name, TelegramBotOptions options)
	{
		if (string.IsNullOrWhiteSpace(options.BotToken))
		{
			return ValidateOptionsResult.Fail("TelegramBot:BotToken is required");
		}

		return ValidateOptionsResult.Success;
	}
}

