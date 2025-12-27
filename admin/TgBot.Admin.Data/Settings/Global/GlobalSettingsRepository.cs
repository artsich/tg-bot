using Microsoft.EntityFrameworkCore;

namespace TgBot.Admin.Data.Settings.Global;

public sealed class GlobalSettingsRepository(AdminDbContext db)
{
	public const string GlobalId = "global";

	public async Task<GlobalSettings> Get()
	{
		return await db.GlobalSettings
			.FirstOrDefaultAsync(x => x.Id == GlobalId) ?? throw new InvalidOperationException("No default settings, wtf!");
	}

	public async Task<GlobalSettings> Update(GlobalSettings doc)
	{
		doc.Id = GlobalId;

		var existing = await db.GlobalSettings
			.FirstOrDefaultAsync(x => x.Id == GlobalId);

		if (existing == null)
		{
			db.GlobalSettings.Add(doc);
		}
		else
		{
			existing.LlmModel = doc.LlmModel;
			existing.HistoryMaxLen = doc.HistoryMaxLen;
			existing.StupidCheck = doc.StupidCheck;
			existing.DailyJokesTime = doc.DailyJokesTime;
			existing.AiInstructions = doc.AiInstructions;
			existing.StupidityInstructions = doc.StupidityInstructions;
			existing.JokeInstructions = doc.JokeInstructions;
		}

		await db.SaveChangesAsync();

		return doc;
	}
}

