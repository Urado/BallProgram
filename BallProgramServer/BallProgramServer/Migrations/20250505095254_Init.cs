using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BallProgramServer.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Nodes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    IsLoop = table.Column<bool>(type: "boolean", nullable: true),
                    IsMuted = table.Column<bool>(type: "boolean", nullable: true),
                    Volume = table.Column<double>(type: "double precision", nullable: true),
                    OrderIndex = table.Column<int>(type: "integer", nullable: false),
                    GroupNodeId = table.Column<Guid>(type: "uuid", nullable: true),
                    NodeType = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    Duration = table.Column<double>(type: "double precision", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Nodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Nodes_Nodes_GroupNodeId",
                        column: x => x.GroupNodeId,
                        principalTable: "Nodes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Nodes_GroupNodeId",
                table: "Nodes",
                column: "GroupNodeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Nodes");
        }
    }
}
