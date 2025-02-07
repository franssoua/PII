using cinemvBack.Models;
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
    public async Task<IActionResult> AjouterFilmFavoris(FavorisDTO favorisDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(favorisDTO.UtilisateurId);
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
    public async Task<IActionResult> SupprimerFilmFavoris(FavorisDTO favorisDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(favorisDTO.UtilisateurId);
        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        if (utilisateur.SupprimerFilmFavoris(favorisDTO.FilmId))
        {
            await _context.SaveChangesAsync();
            return Ok("Film supprimé des favoris avec succès.");
        }

        return BadRequest("Le film n'était pas dans les favoris.");
    }
}
