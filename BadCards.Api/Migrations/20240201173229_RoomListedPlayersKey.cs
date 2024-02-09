using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class RoomListedPlayersKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ListedPlayer",
                table: "ListedPlayer");

            migrationBuilder.AlterColumn<uint>(
                name: "UserId",
                table: "ListedPlayer",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "ListedPlayer",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<uint>(
                name: "LobbyId",
                table: "ListedPlayer",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ListedPlayer",
                table: "ListedPlayer",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ListedPlayer",
                table: "ListedPlayer");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "ListedPlayer");

            migrationBuilder.DropColumn(
                name: "LobbyId",
                table: "ListedPlayer");

            migrationBuilder.AlterColumn<uint>(
                name: "UserId",
                table: "ListedPlayer",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_ListedPlayer",
                table: "ListedPlayer",
                column: "UserId");
        }
    }
}
