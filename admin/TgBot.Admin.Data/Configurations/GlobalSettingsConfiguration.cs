using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TgBot.Admin.Data.Settings.Global;

namespace TgBot.Admin.Data.Configurations;

public sealed class GlobalSettingsConfiguration : IEntityTypeConfiguration<GlobalSettings>
{
	public void Configure(EntityTypeBuilder<GlobalSettings> builder)
	{
		builder.ToTable("settings_global");
		builder.HasKey(e => e.Id);
		builder.Property(e => e.Id).HasColumnName("id").HasMaxLength(50);
		builder.Property(e => e.LlmModel).HasColumnName("llm_model").HasMaxLength(200);
		builder.Property(e => e.HistoryMaxLen).HasColumnName("history_max_len");
		builder.Property(e => e.StupidCheck).HasColumnName("stupid_check");
		builder.Property(e => e.DailyJokesTime).HasColumnName("daily_jokes_time").HasMaxLength(10);
		builder.Property(e => e.AiInstructions).HasColumnName("ai_instructions").HasColumnType("text");
		builder.Property(e => e.StupidityInstructions).HasColumnName("stupidity_instructions").HasColumnType("text");
		builder.Property(e => e.JokeInstructions).HasColumnName("joke_instructions").HasColumnType("text");
	}
}

