// Représente une liste personnalisée de films créée par un utilisateur
// Permet d’ajouter et retirer des films d'une liste nommée
namespace cinemvBack.Models;

public class ListeFilms
{
    public int Id { get; set; }
    public string Titre { get; set; } = null!;
    public string Description { get; set; } = null!;
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public ICollection<string> FilmsIds { get; set; } = new List<string>();

    public ListeFilms() { }

    //met à jour le titre et la description
    public void ModifierListe(string nouveauTitre, string nouvelleDescription)
    {
        Titre = nouveauTitre;
        Description = nouvelleDescription;
    }

    //gestion des films dans la liste
    public bool AjouterFilm(string filmId)
    {
        if (!FilmsIds.Contains(filmId))
        {
            FilmsIds.Add(filmId);
            return true;
        }
        return false;
    }

    public bool SupprimerFilm(string filmId)
    {
        return FilmsIds.Remove(filmId);
    }
}
