using System.Security.Claims;
using cinemvBack.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

[ApiController]
[Route("api/abonnement")]
public class AbonnementController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public AbonnementController(cinemvBackContext context)
    {
        _context = context;
    }

    [HttpGet("liste")]
    public async Task<IActionResult> GetAbonnementsEtAbonnes()
    {
        var utilisateurs = await _context.Utilisateurs.Include(u => u.Abonnements).ToListAsync();

        var result = utilisateurs.Select(u => new
        {
            UtilisateurId = u.Id,
            NomUtilisateur = u.NomUtilisateur,
            Abonnements = u.Abonnements.Select(a => new
            {
                Id = a.Id,
                NomUtilisateur = a.NomUtilisateur,
            }),
            Abonnes = _context
                .Utilisateurs.Where(autre => autre.Abonnements.Any(ab => ab.Id == u.Id))
                .Select(autre => new { Id = autre.Id, NomUtilisateur = autre.NomUtilisateur }),
        });

        return Ok(result);
    }

    [HttpPost("ajouter")]
    [Authorize]
    public async Task<IActionResult> AjouterAbonnement(AbonnementDTO abonnementDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour vous abonner à un utilisateur." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);

        if (abonnementDTO.SuiveurId != userId)
        {
            return Forbid();
        }

        var abonne = await _context.Utilisateurs.FindAsync(userId);
        var abonnement = await _context.Utilisateurs.FindAsync(abonnementDTO.SuiviId);

        if (abonne == null || abonnement == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        if (abonne.AjouterAbonnement(abonnement))
        {
            await _context.SaveChangesAsync();
            return Ok("Abonnement ajouté avec succès.");
        }

        return BadRequest("Vous êtes déjà abonné à cet utilisateur.");
    }

    [HttpDelete("supprimer")]
    [Authorize]
    public async Task<IActionResult> SupprimerAbonnement(AbonnementDTO abonnementDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour vous désabonner d'un utilisateur." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);

        if (abonnementDTO.SuiveurId != userId)
        {
            return Forbid();
        }

        var abonne = await _context.Utilisateurs.FindAsync(userId);
        var abonnement = await _context.Utilisateurs.FindAsync(abonnementDTO.SuiviId);

        if (abonne == null || abonnement == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        if (abonne.SupprimerAbonnement(abonnement))
        {
            await _context.SaveChangesAsync();
            return Ok("Abonnement supprimé avec succès.");
        }

        return BadRequest("Vous n'étiez pas abonné à cet utilisateur.");
    }
}
