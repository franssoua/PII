using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/avis")]
public class AvisController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public AvisController(cinemvBackContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAvis(int id)
    {
        var avis = await _context.Avis.FindAsync(id);
        if (avis == null)
        {
            return NotFound("Avis introuvable.");
        }

        return Ok(new AvisDTO(avis));
    }

    [HttpGet("film/{filmId}")]
    public async Task<IActionResult> GetAvisByFilm(string filmId)
    {
        var avis = await _context.Avis.Where(a => a.FilmId == filmId).ToListAsync();
        if (avis == null)
        {
            return NotFound("Cet utilisateur n'a posté aucun commentaires.");
        }
        var avisDTO = avis.Select(a => new AvisDTO(a)).ToList();

        return Ok(avisDTO);
    }

    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<IActionResult> GetAvisByUtilisateur(int utilisateurId)
    {
        var avis = await _context.Avis.Where(a => a.UtilisateurId == utilisateurId).ToListAsync();
        if (avis == null)
        {
            return NotFound("Cet utilisateur n'a posté aucun commentaires.");
        }
        var avisDTO = avis.Select(a => new AvisDTO(a)).ToList();

        return Ok(avisDTO);
    }

    [HttpPost]
    public async Task<IActionResult> AjouterAvis(AvisDTO avisDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(avisDTO.UtilisateurId);
        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvée.");
        }

        var avis = new Avis
        {
            Contenu = avisDTO.Contenu,
            DateCreation = avisDTO.DateCreation,
            UtilisateurId = avisDTO.UtilisateurId,
            FilmId = avisDTO.FilmId,
        };

        _context.Avis.Add(avis);
        await _context.SaveChangesAsync();

        return Ok(new AvisDTO(avis));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> ModifierAvis(int id, AvisDTO avisDTO)
    {
        var avis = await _context.Avis.FindAsync(id);
        if (avis == null)
        {
            return NotFound();
        }

        avis.Contenu = avisDTO.Contenu;
        await _context.SaveChangesAsync();

        return Ok(new AvisDTO(avis));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> SupprimerAvis(int id)
    {
        var avis = await _context.Avis.FindAsync(id);
        if (avis == null)
        {
            return NotFound("Avis introuvable.");
        }

        _context.Avis.Remove(avis);
        await _context.SaveChangesAsync();

        return Ok("Avis supprimé avec succès");
    }
}
