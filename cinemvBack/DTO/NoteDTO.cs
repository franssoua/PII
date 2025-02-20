public class NoteDTO
{
    public int Id { get; set; }
    public int Valeur { get; set; }
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;

    public NoteDTO() { }

    public NoteDTO(Note note)
    {
        Id = note.Id;
        Valeur = note.Valeur;
        DateCreation = note.DateCreation;
        UtilisateurId = note.UtilisateurId;
        FilmId = note.FilmId;
    }
}
