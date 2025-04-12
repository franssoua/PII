// Utilisé pour transmettre l’information d’un film ajouté en favoris par un utilisateur
public class FavorisDTO
{
    public int UtilisateurId { get; set; }
    public string FilmId { get; set; } = null!;

    public FavorisDTO() { }

    public FavorisDTO(int utilisateurId, string filmId)
    {
        UtilisateurId = utilisateurId;
        FilmId = filmId;
    }
}
