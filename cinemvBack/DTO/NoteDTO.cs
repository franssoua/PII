using System.Text.Json.Serialization;

public class NoteDTO
{
    public int Id { get; set; }
    public double Valeur { get; set; }
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? NomUtilisateur { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public string? PhotoProfil { get; set; }

    public NoteDTO() { }

    public NoteDTO(Note note)
    {
        Id = note.Id;
        Valeur = note.Valeur;
        DateCreation = note.DateCreation;
        UtilisateurId = note.UtilisateurId;
        FilmId = note.FilmId;
        if (note.Utilisateur != null)
        {
            NomUtilisateur = note.Utilisateur.NomUtilisateur;
            PhotoProfil = note.Utilisateur.PhotoProfil;
        }
    }
}
