using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

// Contrôleur pour la gestion des films favoris d’un utilisateur
[ApiController]
[Route("api/favoris")]
public class FavorisController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public FavorisController(cinemvBackContext context)
    {
        _context = context;
    }

    //Route pour récupérer tous les films mis en favoris par les utilisateurs
    [HttpGet("liste")]
    public async Task<IActionResult> GetFilmsFavoris()
    {
        var utilisateurs = await _context.Utilisateurs.ToListAsync();

        var result = utilisateurs.Select(u => new
        {
            UtilisateurId = u.Id,
            NomUtilisateur = u.NomUtilisateur,
            FavorisFilms = u.FavorisFilmsIds.ToList(),
        });

        return Ok(result);
    }

    //Route pour ajouter un film aux favoris
    [HttpPost("ajouter")]
    [Authorize]
    public async Task<IActionResult> AjouterFilmFavoris(FavorisDTO favorisDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Vous devez être connecté pour ajouter un film à vos favoris.");
        }

        int userId = int.Parse(userIdClaim.Value);

        var utilisateur = await _context.Utilisateurs.FindAsync(userId);
        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        if (utilisateur.AjouterFilmFavoris(favorisDTO.FilmId))
        {
            await _context.SaveChangesAsync();
            return Ok("Film ajouté aux favoris avec succès.");
        }

        return BadRequest("Le film est déjà dans les favoris.");
    }

    //Route pour retirer un film des favoris
    [HttpDelete("supprimer")]
    [Authorize]
    public async Task<IActionResult> SupprimerFilmFavoris(FavorisDTO favorisDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour supprimer un film de vos favoris." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        var utilisateur = await _context.Utilisateurs.FindAsync(userId);
        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        if (favorisDTO.UtilisateurId != userId && !isAdmin)
        {
            return Forbid();
        }

        if (utilisateur.SupprimerFilmFavoris(favorisDTO.FilmId))
        {
            await _context.SaveChangesAsync();
            return Ok("Film supprimé des favoris avec succès.");
        }

        return BadRequest("Le film n'était pas dans les favoris.");
    }
}
