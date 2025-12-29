using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using TgBot;
using TgBot.Admin.Api.Options;

namespace TgBot.Admin.Api.Services;

public class TelegramBotBackgroundService : BackgroundService
{
	private readonly TelegramBot _bot;
	private readonly ILogger<TelegramBotBackgroundService> _logger;

	public TelegramBotBackgroundService(
		IOptions<TelegramBotOptions> options,
		ILoggerFactory loggerFactory)
	{
		_logger = loggerFactory.CreateLogger<TelegramBotBackgroundService>();
		var botLogger = loggerFactory.CreateLogger<TelegramBot>();
		_bot = new TelegramBot(options.Value.BotToken, botLogger);
	}

	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		try
		{
			await _bot.StartAsync(stoppingToken);
			await Task.Delay(Timeout.Infinite, stoppingToken);
		}
		catch (OperationCanceledException)
		{
			_logger.LogInformation("Bot background service is stopping...");
		}
		finally
		{
			await _bot.StopAsync();
		}
	}
}

