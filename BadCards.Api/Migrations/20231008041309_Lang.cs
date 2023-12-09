﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class Lang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Lang",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Lang",
                table: "Users");
        }
    }
}
