using cinemvBack.Models;
using Microsoft.EntityFrameworkCore;

public class cinemvBackContext : DbContext
{
    public DbSet<Utilisateur> Utilisateurs { get; set; } = null!;
    public DbSet<Abonnement> Abonnements { get; set; } = null!;
    public DbSet<Avis> Avis { get; set; } = null!;
    public DbSet<Favoris> Favoris { get; set; } = null!;
    public DbSet<Genre> Genres { get; set; } = null!;
    public DbSet<ListeFilms> ListeFilms { get; set; } = null!;
    public DbSet<Note> Notes { get; set; } = null!;

    public string DbPath { get; private set; }

    public cinemvBackContext()
    {
        // Path to SQLite database file
        DbPath = "cinemvBack.db";
    }

    // The following configures EF to create a SQLite database file locally
    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        // Use SQLite as database
        options.UseSqlite($"Data Source={DbPath}");
        // Optional: log SQL queries to console
        //options.LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information);
    }
}
