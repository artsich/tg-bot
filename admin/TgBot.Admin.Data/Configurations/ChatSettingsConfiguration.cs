using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TgBot.Admin.Data.Settings.Chats;

namespace TgBot.Admin.Data.Configurations;

public sealed class ChatSettingsConfiguration : IEntityTypeConfiguration<ChatSettings>
{
	public void Configure(EntityTypeBuilder<ChatSettings> builder)
	{
		builder.ToTable("chat_settings");
		builder.HasKey(e => e.ChatId);
		builder.Property(e => e.ChatId)
			.HasColumnName("chat_id")
			.ValueGeneratedNever();
		builder.Property(e => e.StupidityCheck).HasColumnName("stupidity_check");
		builder.Property(e => e.JokeSubscribed).HasColumnName("joke_subscribed");
		builder.Property(e => e.JokeTopic).HasColumnName("joke_topic").HasMaxLength(500);
	}
}

