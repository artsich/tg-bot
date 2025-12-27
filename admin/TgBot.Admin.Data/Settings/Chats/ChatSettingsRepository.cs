using Microsoft.EntityFrameworkCore;

namespace TgBot.Admin.Data.Settings.Chats;

public sealed class ChatSettingsRepository(AdminDbContext db)
{
	public async Task<IReadOnlyList<ChatSettings>> GetAll()
	{
		return await db.ChatSettings
			.OrderBy(x => x.ChatId)
			.ToListAsync();
	}

	public async Task<ChatSettings?> Get(long chatId)
	{
		return await db.ChatSettings
			.FirstOrDefaultAsync(x => x.ChatId == chatId);
	}

	public async Task<ChatSettings> Upsert(ChatSettings doc)
	{
		var existing = await db.ChatSettings
			.FirstOrDefaultAsync(x => x.ChatId == doc.ChatId);

		if (existing == null)
		{
			db.ChatSettings.Add(doc);
		}
		else
		{
			existing.StupidityCheck = doc.StupidityCheck;
			existing.JokeSubscribed = doc.JokeSubscribed;
			existing.JokeTopic = doc.JokeTopic;
		}

		await db.SaveChangesAsync();

		return doc;
	}
}

