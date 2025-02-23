﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinemvBack.Migrations
{
    /// <inheritdoc />
    public partial class CleToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "Utilisateurs",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "Utilisateurs");
        }
    }
}
