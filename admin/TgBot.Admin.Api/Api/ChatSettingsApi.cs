using TgBot.Admin.Api.Api.Contracts;
using TgBot.Admin.Api.Api.Validation;
using TgBot.Admin.Api.Settings.Chats;

namespace TgBot.Admin.Api.Api;

public static class ChatSettingsApi
{
	public static RouteGroupBuilder MapChatSettingsApi(this RouteGroupBuilder api)
	{
		api.MapGet("/chats", async (ChatSettingsRepository repo) =>
		{
			var docs = await repo.GetAll();
			var data = docs.Select(ToChat).ToArray();
			return Results.Ok(data);
		});

		api.MapGet("/chats/{chatId:long}/settings", async (long chatId, ChatSettingsRepository repo) =>
		{
			var doc = await repo.Get(chatId);
			if (doc is null)
				return Results.NotFound();

			return Results.Ok(ToChat(doc));
		});

		api.MapPut("/chats/{chatId:long}/settings", async (long chatId, ChatSettingsPut put, ChatSettingsRepository repo) =>
		{
			var current = await repo.Get(chatId) ?? new Settings.Chats.ChatSettings { ChatId = chatId };
			ApplyPut(current, put);
			var saved = await repo.Upsert(current);
			return Results.Ok(ToChat(saved));
		}).WithFluentValidation<ChatSettingsPut>();

		return api;
	}

	private static Contracts.ChatSettings ToChat(Settings.Chats.ChatSettings doc) =>
		new(
			doc.ChatId,
			doc.StupidityCheck,
			doc.JokeSubscribed,
			doc.JokeTopic
		);

	private static void ApplyPut(Settings.Chats.ChatSettings current, ChatSettingsPut put)
	{
		current.StupidityCheck = put.StupidityCheck ?? current.StupidityCheck;
		current.JokeSubscribed = put.JokeSubscribed ?? current.JokeSubscribed;
		current.JokeTopic = put.JokeTopic ?? current.JokeTopic;
	}
}
