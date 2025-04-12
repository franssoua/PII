// Représente un lien d’abonnement entre deux utilisateurs (suiveur et suivi)
using cinemvBack.Models;

public class Abonnement
{
    public int Id { get; set; }
    public int SuiveurId { get; set; }
    public Utilisateur Suiveur { get; set; } = null!;
    public int SuiviId { get; set; }
    public Utilisateur Suivi { get; set; } = null!;

    public Abonnement() { }
}
