using MongoDB.Driver;

namespace TgBot.Admin.Api.Settings.Chats;

public sealed class ChatSettingsRepository(IMongoDatabase db)
{
	private const string CollectionName = "chat_settings";

	private readonly IMongoCollection<ChatSettingsDocument> _collection = db.GetCollection<ChatSettingsDocument>(CollectionName);

	public async Task<IReadOnlyList<ChatSettingsDocument>> GetAll()
	{
		var docs = await _collection
			.Find(_ => true)
			.SortBy(x => x.ChatId)
			.ToListAsync();

		return docs;
	}

	public async Task<ChatSettingsDocument?> Get(long chatId)
	{
		var doc = await _collection
			.Find(x => x.ChatId == chatId)
			.FirstOrDefaultAsync();

		return doc;
	}

	public async Task<ChatSettingsDocument> Upsert(ChatSettingsDocument doc)
	{
		await _collection.ReplaceOneAsync(
			x => x.ChatId == doc.ChatId,
			doc,
			new ReplaceOptions { IsUpsert = true }
		);

		return doc;
	}
}


