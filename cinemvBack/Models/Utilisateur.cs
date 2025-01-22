namespace cinemvBack.Models;

public class Utilisateur
{
    public int Id { get; set; }
    public string NomUtilisateur { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string MotDePasse { get; set; } = null!;
    public DateTime DateInscription { get; set; } //=DateTime.Now;
    public ICollection<ListeFilms>? Listes { get; set; }
    public ICollection<Avis>? Avis { get; set; }
    public ICollection<Note>? Notes { get; set; }
    public ICollection<Utilisateur>? Abonnements { get; set; }

    public Utilisateur() { }
}
