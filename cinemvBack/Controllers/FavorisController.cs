using System.Security.Claims;
using cinemvBack.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

[ApiController]
[Route("api/favoris")]
public class FavorisController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public FavorisController(cinemvBackContext context)
    {
        _context = context;
    }

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
