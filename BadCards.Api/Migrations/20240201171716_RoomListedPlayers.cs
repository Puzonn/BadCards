using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class RoomListedPlayers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ListedPlayer",
                columns: table => new
                {
                    UserId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    IsOwner = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsGuest = table.Column<bool>(type: "INTEGER", nullable: false),
                    Blacklisted = table.Column<bool>(type: "INTEGER", nullable: false),
                    RoomDbRoomId = table.Column<uint>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListedPlayer", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_ListedPlayer_Rooms_RoomDbRoomId",
                        column: x => x.RoomDbRoomId,
                        principalTable: "Rooms",
                        principalColumn: "RoomId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ListedPlayer_RoomDbRoomId",
                table: "ListedPlayer",
                column: "RoomDbRoomId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListedPlayer");
        }
    }
}
