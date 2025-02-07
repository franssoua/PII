public class NoteDTO
{
    public int Id { get; set; }
    public int Valeur { get; set; }
    public DateTime DateCreation { get; set; }
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;
}
