using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinemvBack.Migrations
{
    /// <inheritdoc />
    public partial class SecondCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ListeFilms_Utilisateurs_UtilisateurId",
                table: "ListeFilms");

            migrationBuilder.DropTable(
                name: "Commentaires");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ListeFilms",
                table: "ListeFilms");

            migrationBuilder.RenameTable(
                name: "ListeFilms",
                newName: "ListesFilms");

            migrationBuilder.RenameIndex(
                name: "IX_ListeFilms_UtilisateurId",
                table: "ListesFilms",
                newName: "IX_ListesFilms_UtilisateurId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ListesFilms",
                table: "ListesFilms",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Avis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Contenu = table.Column<string>(type: "TEXT", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UtilisateurId = table.Column<int>(type: "INTEGER", nullable: false),
                    FilmId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Avis", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Avis_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Avis_UtilisateurId",
                table: "Avis",
                column: "UtilisateurId");

            migrationBuilder.AddForeignKey(
                name: "FK_ListesFilms_Utilisateurs_UtilisateurId",
                table: "ListesFilms",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ListesFilms_Utilisateurs_UtilisateurId",
                table: "ListesFilms");

            migrationBuilder.DropTable(
                name: "Avis");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ListesFilms",
                table: "ListesFilms");

            migrationBuilder.RenameTable(
                name: "ListesFilms",
                newName: "ListeFilms");

            migrationBuilder.RenameIndex(
                name: "IX_ListesFilms_UtilisateurId",
                table: "ListeFilms",
                newName: "IX_ListeFilms_UtilisateurId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ListeFilms",
                table: "ListeFilms",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Commentaires",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UtilisateurId = table.Column<int>(type: "INTEGER", nullable: false),
                    Contenu = table.Column<string>(type: "TEXT", nullable: false),
                    DateCreation = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FilmId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Commentaires", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Commentaires_Utilisateurs_UtilisateurId",
                        column: x => x.UtilisateurId,
                        principalTable: "Utilisateurs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Commentaires_UtilisateurId",
                table: "Commentaires",
                column: "UtilisateurId");

            migrationBuilder.AddForeignKey(
                name: "FK_ListeFilms_Utilisateurs_UtilisateurId",
                table: "ListeFilms",
                column: "UtilisateurId",
                principalTable: "Utilisateurs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
