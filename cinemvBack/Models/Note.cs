// Modèle représentant une note laissée par un utilisateur sur un film
using cinemvBack.Models;

public class Note
{
    public int Id { get; set; }
    public double Valeur { get; set; }
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public string FilmId { get; set; } = null!;

    public Note() { }

    public Note(NoteDTO noteDTO)
    {
        Id = noteDTO.Id;
        Valeur = noteDTO.Valeur;
        DateCreation = noteDTO.DateCreation;
        UtilisateurId = noteDTO.UtilisateurId;
        FilmId = noteDTO.FilmId;
    }
}
