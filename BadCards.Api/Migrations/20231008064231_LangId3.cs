using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BadCards.Api.Migrations
{
    /// <inheritdoc />
    public partial class LangId3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CardTranslations",
                table: "CardTranslations");

            migrationBuilder.AlterColumn<uint>(
                name: "CardId",
                table: "CardTranslations",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddColumn<uint>(
                name: "Id",
                table: "CardTranslations",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardTranslations",
                table: "CardTranslations",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CardTranslations",
                table: "CardTranslations");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "CardTranslations");

            migrationBuilder.AlterColumn<uint>(
                name: "CardId",
                table: "CardTranslations",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(uint),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_CardTranslations",
                table: "CardTranslations",
                column: "CardId");
        }
    }
}
