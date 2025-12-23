using TgChat.Admin.Api.Api.Contracts;
using TgChat.Admin.Api.Api.Validation;
using TgChat.Admin.Api.Settings;
using TgChat.Admin.Api.Settings.Global;

namespace TgChat.Admin.Api.Api;

public static class GlobalSettingsApi
{
	public static RouteGroupBuilder MapGlobalSettingsApi(this RouteGroupBuilder api)
	{
		api.MapGet("/settings/global", async (GlobalSettingsRepository repo) =>
		{
			var doc = await repo.Get();
			return Results.Ok(new ApiResponse<GlobalSettings>(true, ToContract(doc)));
		});

		api.MapPut("/settings/global", async (GlobalSettingsPatch patch, GlobalSettingsRepository repo) =>
		{
			var current = await repo.Get();
			ApplyPatch(current, patch);
			var saved = await repo.Update(current);
			return Results.Ok(new ApiResponse<GlobalSettings>(true, ToContract(saved)));
		}).WithFluentValidation<GlobalSettingsPatch>();

		return api;
	}

	private static GlobalSettings ToContract(GlobalSettingsDocument doc) =>
		new(
			doc.LlmModel!,
			doc.HistoryMaxLen!.Value,
			doc.StupidCheck!.Value,
			doc.DailyJokesTime!,
			doc.AiInstructions!,
			doc.StupidityInstructions!,
			doc.JokeInstructions!
		);

	private static void ApplyPatch(GlobalSettingsDocument current, GlobalSettingsPatch patch)
	{
		if (patch.LlmModel is not null)
			current.LlmModel = patch.LlmModel;

		if (patch.HistoryMaxLen is not null)
			current.HistoryMaxLen = patch.HistoryMaxLen.Value;

		if (patch.StupidCheck is not null)
			current.StupidCheck = patch.StupidCheck.Value;

		if (patch.DailyJokesTime is not null)
			current.DailyJokesTime = patch.DailyJokesTime;

		if (patch.AiInstructions is not null)
			current.AiInstructions = patch.AiInstructions;

		if (patch.StupidityInstructions is not null)
			current.StupidityInstructions = patch.StupidityInstructions;

		if (patch.JokeInstructions is not null)
			current.JokeInstructions = patch.JokeInstructions;
	}
}


