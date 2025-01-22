using cinemvBack.Models;

public class Note
{
    public int Id { get; set; }
    public int Valeur { get; set; }
    public DateTime DateCreation { get; set; } //=DateTime.Now;
    public int UtilisateurId { get; set; }
    public Utilisateur Utilisateur { get; set; } = null!;
    public string FilmId { get; set; } = null!;

    public Note() { }
}
