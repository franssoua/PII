using System.Text.Json.Serialization;
using cinemvBack.Models;

public class ListeFilmsDTO
{
    [JsonPropertyName("Id")]
    public int Id { get; set; }
    public int UtilisateurId { get; set; }

    [JsonPropertyName("Titre")]
    public string Titre { get; set; } = null!;

    [JsonPropertyName("Description")]
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
