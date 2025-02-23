using System;
using System.Linq;
using cinemvBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace cinemvBack.Data;

public static class SeedData
{
    public static void Init(IServiceProvider serviceProvider)
    {
        using var context = new cinemvBackContext(
            serviceProvider.GetRequiredService<DbContextOptions<cinemvBackContext>>()
        );

        // if (context.Utilisateurs.Any() || context.ListesFilms.Any())
        // {
        //     return;
        // }

        //Ajout d’éléments de la première classe
        Utilisateur utilisateur1 = new()
        {
            NomUtilisateur = "Axelle",
            Email = "aagez@ensc.fr",
            MotDePasse = BCrypt.Net.BCrypt.HashPassword("pdw12345"),
            DateInscription = DateTime.Parse("2025-01-11"),
        };

        Utilisateur utilisateur2 = new()
        {
            NomUtilisateur = "Elliot",
            Email = "egreneche@ensc.fr",
            MotDePasse = BCrypt.Net.BCrypt.HashPassword("potin54321"),
            DateInscription = DateTime.Parse("2024-12-21"),
        };

        Utilisateur utilisateur3 = new()
        {
            NomUtilisateur = "admin",
            Email = "admin@ensc.fr",
            MotDePasse = BCrypt.Net.BCrypt.HashPassword("admin"),
            IsAdmin = true,
            DateInscription = DateTime.Parse("2025-02-21"),
        };

        context.Utilisateurs.AddRange(utilisateur1, utilisateur2, utilisateur3);

        context.SaveChanges();

        //Ajout d’éléments de la deuxième classe
        ListeFilms liste1 = new()
        {
            Titre = "Films Marvel préférés",
            Description = "Liste des meilleurs Marvel.",
            UtilisateurId = utilisateur1.Id,
            FilmsIds = new List<string> { "tt0111161", "tt0068646", "tt0468569" },
        };

        ListeFilms liste2 = new()
        {
            Titre = "Films à regarder",
            Description = "Liste des films que je dois voir cette année.",
            UtilisateurId = utilisateur2.Id,
            FilmsIds = new List<string> { "tt1375666", "tt0816692", "tt4154796" },
        };

        ListeFilms liste3 = new()
        {
            Titre = "Classiques",
            Description = "Liste des films que tout le monde devrait regarder.",
            UtilisateurId = utilisateur1.Id,
            FilmsIds = new List<string> { "tt0050083", "tt0073486", "tt0038650" },
        };

        context.ListesFilms.AddRange(liste1, liste2, liste3);

        context.SaveChanges();

        utilisateur1.Abonnements = new List<Utilisateur> { utilisateur2 };
        utilisateur2.Abonnements = new List<Utilisateur> { utilisateur1 };

        context.Utilisateurs.Update(utilisateur1);
        context.Utilisateurs.Update(utilisateur2);

        context.SaveChanges();
    }
}
