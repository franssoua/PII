using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinemvBack.Migrations
{
    /// <inheritdoc />
    public partial class FavorisFilmId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FavorisFilmsIds",
                table: "Utilisateurs",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FavorisFilmsIds",
                table: "Utilisateurs");
        }
    }
}
