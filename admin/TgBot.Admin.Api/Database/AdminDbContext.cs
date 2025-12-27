using Microsoft.EntityFrameworkCore;
using TgBot.Admin.Api.Settings.Chats;
using TgBot.Admin.Api.Settings.Global;

namespace TgBot.Admin.Api.Database;

public sealed class AdminDbContext(DbContextOptions<AdminDbContext> options) : DbContext(options)
{
	public DbSet<ChatSettings> ChatSettings { get; set; } = null!;

	public DbSet<GlobalSettings> GlobalSettings { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.Entity<ChatSettings>(entity =>
		{
			entity.ToTable("chat_settings");
			entity.HasKey(e => e.ChatId);
			entity.Property(e => e.ChatId).HasColumnName("chat_id");
			entity.Property(e => e.StupidityCheck).HasColumnName("stupidity_check");
			entity.Property(e => e.JokeSubscribed).HasColumnName("joke_subscribed");
			entity.Property(e => e.JokeTopic).HasColumnName("joke_topic").HasMaxLength(500);
		});

		modelBuilder.Entity<GlobalSettings>(entity =>
		{
			entity.ToTable("settings_global");
			entity.HasKey(e => e.Id);
			entity.Property(e => e.Id).HasColumnName("id").HasMaxLength(50);
			entity.Property(e => e.LlmModel).HasColumnName("llm_model").HasMaxLength(200);
			entity.Property(e => e.HistoryMaxLen).HasColumnName("history_max_len");
			entity.Property(e => e.StupidCheck).HasColumnName("stupid_check");
			entity.Property(e => e.DailyJokesTime).HasColumnName("daily_jokes_time").HasMaxLength(10);
			entity.Property(e => e.AiInstructions).HasColumnName("ai_instructions").HasColumnType("text");
			entity.Property(e => e.StupidityInstructions).HasColumnName("stupidity_instructions").HasColumnType("text");
			entity.Property(e => e.JokeInstructions).HasColumnName("joke_instructions").HasColumnType("text");
		});

		base.OnModelCreating(modelBuilder);
	}
}

