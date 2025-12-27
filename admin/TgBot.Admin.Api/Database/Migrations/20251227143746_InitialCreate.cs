using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TgBot.Admin.Api.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "chat_settings",
                columns: table => new
                {
                    chat_id = table.Column<long>(type: "bigint", nullable: false),
                    stupidity_check = table.Column<bool>(type: "boolean", nullable: false),
                    joke_subscribed = table.Column<bool>(type: "boolean", nullable: false),
                    joke_topic = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chat_settings", x => x.chat_id);
                });

            migrationBuilder.CreateTable(
                name: "settings_global",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    llm_model = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    history_max_len = table.Column<int>(type: "integer", nullable: true),
                    stupid_check = table.Column<double>(type: "double precision", nullable: true),
                    daily_jokes_time = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    ai_instructions = table.Column<string>(type: "text", nullable: true),
                    stupidity_instructions = table.Column<string>(type: "text", nullable: true),
                    joke_instructions = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_settings_global", x => x.id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "chat_settings");

            migrationBuilder.DropTable(
                name: "settings_global");
        }
    }
}
