using System.Text.Json.Serialization;
using cinemvBack.Models;

public class ListeFilmsDTO
{
    public int Id { get; set; }
    public int UtilisateurId { get; set; }
    public string Titre { get; set; } = null!;
    public string Description { get; set; } = null!;
    public List<string> FilmsIds { get; set; } = new List<string>();

    public ListeFilmsDTO() { }

    public ListeFilmsDTO(ListeFilms listeFilms)
    {
        Id = listeFilms.Id;
        UtilisateurId = listeFilms.UtilisateurId;
        Titre = listeFilms.Titre;
        Description = listeFilms.Description;
        FilmsIds = listeFilms.FilmsIds.ToList();
    }
}
