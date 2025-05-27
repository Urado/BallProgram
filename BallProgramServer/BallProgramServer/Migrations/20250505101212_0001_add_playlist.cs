using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BallProgramServer.Migrations
{
    /// <inheritdoc />
    public partial class _0001_add_playlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nodes_Nodes_GroupNodeId",
                table: "Nodes");

            migrationBuilder.RenameColumn(
                name: "GroupNodeId",
                table: "Nodes",
                newName: "ParentId");

            migrationBuilder.RenameIndex(
                name: "IX_Nodes_GroupNodeId",
                table: "Nodes",
                newName: "IX_Nodes_ParentId");

            migrationBuilder.AddColumn<Guid>(
                name: "PlaylistId",
                table: "Nodes",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Playlists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Playlists", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nodes_PlaylistId",
                table: "Nodes",
                column: "PlaylistId");

            migrationBuilder.AddForeignKey(
                name: "FK_Nodes_Nodes_ParentId",
                table: "Nodes",
                column: "ParentId",
                principalTable: "Nodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Nodes_Playlists_PlaylistId",
                table: "Nodes",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Nodes_Nodes_ParentId",
                table: "Nodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Nodes_Playlists_PlaylistId",
                table: "Nodes");

            migrationBuilder.DropTable(
                name: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Nodes_PlaylistId",
                table: "Nodes");

            migrationBuilder.DropColumn(
                name: "PlaylistId",
                table: "Nodes");

            migrationBuilder.RenameColumn(
                name: "ParentId",
                table: "Nodes",
                newName: "GroupNodeId");

            migrationBuilder.RenameIndex(
                name: "IX_Nodes_ParentId",
                table: "Nodes",
                newName: "IX_Nodes_GroupNodeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Nodes_Nodes_GroupNodeId",
                table: "Nodes",
                column: "GroupNodeId",
                principalTable: "Nodes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
