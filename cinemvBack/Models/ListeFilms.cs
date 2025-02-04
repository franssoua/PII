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

    public void ModifierListe(string nouveauTitre, string nouvelleDescription)
    {
        Titre = nouveauTitre;
        Description = nouvelleDescription;
    }

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
