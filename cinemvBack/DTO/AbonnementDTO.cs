// Sert à transmettre les données d’un abonnement entre deux utilisateurs
public class AbonnementDTO
{
    public int SuiveurId { get; set; }
    public int SuiviId { get; set; }

    public AbonnementDTO() { }

    public AbonnementDTO(int suiveurId, int suiviId)
    {
        SuiveurId = suiveurId;
        SuiviId = suiviId;
    }
}
