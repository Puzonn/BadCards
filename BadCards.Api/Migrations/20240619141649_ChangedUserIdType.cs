using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangedUserIdType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ListedPlayer");

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Users");

            migrationBuilder.CreateTable(
                name: "ListedPlayer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Blacklisted = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsGuest = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsOwner = table.Column<bool>(type: "INTEGER", nullable: false),
                    LobbyId = table.Column<uint>(type: "INTEGER", nullable: false),
                    RoomDbRoomId = table.Column<uint>(type: "INTEGER", nullable: true),
                    UserId = table.Column<uint>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ListedPlayer", x => x.Id);
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
    }
}
