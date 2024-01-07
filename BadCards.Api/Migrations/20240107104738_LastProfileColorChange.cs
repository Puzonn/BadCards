using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class LastProfileColorChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastProfileColorChange",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastProfileColorChange",
                table: "Users");
        }
    }
}
