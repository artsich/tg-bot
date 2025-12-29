using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using Microsoft.Extensions.Logging;

namespace TgBot;

public class TelegramBot(string botToken, ILogger<TelegramBot> logger)
{
	private readonly TelegramBotClient _bot = new(botToken);
	private CancellationTokenSource? _cancellationTokenSource;

	public async Task StartAsync(CancellationToken cancellationToken = default)
	{
		_cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

		var me = await _bot.GetMe(cancellationToken: _cancellationTokenSource.Token);
		logger.LogInformation($"Bot {me.Username} is starting...");

		_bot.OnMessage += OnMessage;
		_bot.OnError += OnError;

		logger.LogInformation($"Bot {me.Username} is running...");
	}

	public async Task StopAsync()
	{
		if (_cancellationTokenSource != null)
		{
			_cancellationTokenSource.Cancel();
			logger.LogInformation("Bot is stopping...");
		}
		await Task.CompletedTask;
	}

	private async Task OnMessage(Message msg, UpdateType type)
	{
		if (msg.Text is null) return;

		logger.LogInformation("Received {Type} '{Text}' in chat {ChatId}", type, msg.Text, msg.Chat.Id);

		await _bot.SendMessage(
			chatId: msg.Chat.Id,
			text: msg.Text,
			cancellationToken: _cancellationTokenSource?.Token ?? CancellationToken.None);
	}

	private async Task OnError(Exception exception, HandleErrorSource source)
	{
		logger.LogError(exception, "Bot error from {Source}", source);
		await Task.CompletedTask;
	}
}

