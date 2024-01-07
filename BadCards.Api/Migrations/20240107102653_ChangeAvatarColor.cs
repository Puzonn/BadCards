using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAvatarColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AvatarColor",
                table: "Users",
                newName: "ProfileColor");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfileColor",
                table: "Users",
                newName: "AvatarColor");
        }
    }
}
