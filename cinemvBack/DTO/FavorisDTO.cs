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
