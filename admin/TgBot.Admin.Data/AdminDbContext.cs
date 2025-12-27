using Microsoft.EntityFrameworkCore;
using TgBot.Admin.Data.Settings.Chats;
using TgBot.Admin.Data.Settings.Global;

namespace TgBot.Admin.Data;

public sealed class AdminDbContext(DbContextOptions<AdminDbContext> options) : DbContext(options)
{
	public DbSet<ChatSettings> ChatSettings { get; set; } = null!;

	public DbSet<GlobalSettings> GlobalSettings { get; set; } = null!;

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		modelBuilder.ApplyConfigurationsFromAssembly(typeof(AdminDbContext).Assembly);
		base.OnModelCreating(modelBuilder);
	}
}

