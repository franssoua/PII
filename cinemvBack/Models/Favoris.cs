// Représente un lien entre un utilisateur et un film ajouté à ses favoris
using cinemvBack.Models;

public class Favoris
{
    public int Id { get; set; }
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public string FilmsId { get; set; } = null!;

    public Favoris() { }
}
