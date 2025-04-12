using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Contrôleur permettant la gestion des avis/commentaires des utilisateurs
[ApiController]
[Route("api/avis")]
public class AvisController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public AvisController(cinemvBackContext context)
    {
        _context = context;
    }

    //Route pour récupérer un avis spécifique
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

    //Route pour récupérer tous les avis d'un film spécifique
    [HttpGet("film/{filmId}")]
    public async Task<IActionResult> GetAvisByFilm(string filmId)
    {
        var avis = await _context
            .Avis.Include(a => a.Utilisateur)
            .Where(a => a.FilmId == filmId)
            .ToListAsync();
        if (avis == null)
        {
            return NotFound("Cet utilisateur n'a posté aucun commentaires.");
        }
        var avisDTO = avis.Select(a => new AvisDTO(a)).ToList();

        return Ok(avisDTO);
    }

    //Route pour récupérer tous les avis d'un utilisateur spécifique
    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<IActionResult> GetAvisByUtilisateur(int utilisateurId)
    {
        var avis = await _context
            .Avis.Include(a => a.Utilisateur)
            .Where(a => a.UtilisateurId == utilisateurId)
            .ToListAsync();
        if (avis == null)
        {
            return NotFound("Cet utilisateur n'a posté aucun commentaires.");
        }
        var avisDTO = avis.Select(a => new AvisDTO(a)).ToList();

        return Ok(avisDTO);
    }

    //Route pour poster un avis
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AjouterAvis(AvisDTO avisDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Vous devez être connecté pour poster un avis.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");
        var existingAvis = await _context.Avis.FirstOrDefaultAsync(a =>
            a.UtilisateurId == userId && a.FilmId == avisDTO.FilmId
        );

        if (existingAvis != null)
        {
            return BadRequest("Vous avez déjà laissé un avis pour ce film.");
        }

        if (avisDTO.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit d'ajouter un avis pour un autre utilisateur."
            );
        }

        var utilisateur = await _context.Utilisateurs.FindAsync(userId);
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

    //Route pour modifier un avis
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> ModifierAvis(int id, AvisDTO avisDTO)
    {
        var avis = await _context.Avis.FindAsync(id);
        if (avis == null)
        {
            return NotFound("Avis introuvable.");
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Utilisateur non authentifié.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        if (avis.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit de modifier cet avis."
            );
        }

        avis.Contenu = avisDTO.Contenu;
        await _context.SaveChangesAsync();

        return Ok(new AvisDTO(avis));
    }

    //Route pour supprimer un avis
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> SupprimerAvis(int id)
    {
        var avis = await _context.Avis.FindAsync(id);
        if (avis == null)
        {
            return NotFound("Avis introuvable.");
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Utilisateur non authentifié.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        if (avis.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit de supprimer cet avis."
            );
        }

        _context.Avis.Remove(avis);
        await _context.SaveChangesAsync();

        return Ok("Avis supprimé avec succès");
    }
}
