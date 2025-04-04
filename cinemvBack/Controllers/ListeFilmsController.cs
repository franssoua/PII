using System.Security.Claims;
using cinemvBack.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

[ApiController]
[Route("api/listeFilms")]
public class ListeFilmsController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public ListeFilmsController(cinemvBackContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListeFilmsDTO>>> GetListeFilms()
    {
        var listesFilms = _context.ListesFilms.Select(x => new ListeFilmsDTO(x));
        return await listesFilms.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ListeFilmsDTO>> GetUtilisateur(int id)
    {
        var listeFilms = await _context.ListesFilms.FindAsync(id);

        if (listeFilms == null)
            return NotFound("Liste de films non trouvée.");

        return new ListeFilmsDTO(listeFilms);
    }

    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<ActionResult<IEnumerable<ListeFilmsDTO>>> GetListesByUtilisateur(
        int utilisateurId
    )
    {
        var listes = await _context
            .ListesFilms.Where(l => l.UtilisateurId == utilisateurId)
            .ToListAsync();

        var dtoListes = listes.Select(l => new ListeFilmsDTO(l)).ToList();
        return Ok(dtoListes);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateList(ListeFilmsDTO listeFilmsDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(new { message = "Vous devez être connecté pour créer une liste." });
        }

        int userId = int.Parse(userIdClaim.Value);

        if (listeFilmsDTO.UtilisateurId != userId)
        {
            return Forbid();
        }

        var utilisateur = await _context.Utilisateurs.FindAsync(userId);
        if (utilisateur == null)
        {
            return BadRequest("Utilisateur inexistant.");
        }

        var listeFilms = new ListeFilms
        {
            Titre = listeFilmsDTO.Titre,
            Description = listeFilmsDTO.Description,
            UtilisateurId = listeFilmsDTO.UtilisateurId,
            Utilisateur = utilisateur,
            FilmsIds = listeFilmsDTO.FilmsIds.ToList(),
        };

        _context.ListesFilms.Add(listeFilms);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetListeFilms),
            new { id = listeFilms.Id },
            new ListeFilmsDTO(listeFilms)
        );
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateList(int id, [FromBody] ListeFilmsDTO listeFilmsDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour modifier une liste." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        var listeFilms = await _context.ListesFilms.FindAsync(id);

        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (listeFilms.UtilisateurId != userId)
        {
            return Forbid();
        }

        listeFilms.ModifierListe(listeFilmsDTO.Titre, listeFilmsDTO.Description);
        await _context.SaveChangesAsync();

        return Ok("Liste mise à jour avec succès.");
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteList(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour supprimer une liste." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");
        var listeFilms = await _context.ListesFilms.FindAsync(id);

        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (listeFilms.UtilisateurId != userId && !isAdmin)
        {
            return Forbid();
        }

        _context.ListesFilms.Remove(listeFilms);
        await _context.SaveChangesAsync();

        return Ok("Liste supprimée avec succès.");
    }

    [HttpPost("{id}/ajouterFilm")]
    [Authorize]
    public async Task<IActionResult> AjouterFilm(int id, [FromBody] string filmId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour ajouter un film à une liste." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        var listeFilms = await _context.ListesFilms.FindAsync(id);

        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (listeFilms.UtilisateurId != userId)
        {
            return Forbid();
        }

        if (!listeFilms.AjouterFilm(filmId))
        {
            return BadRequest("Ce film est déjà dans cette liste.");
        }

        await _context.SaveChangesAsync();
        return Ok("Film ajouté à la liste avec succès.");
    }

    [HttpPost("{id}/supprimerFilm")]
    [Authorize]
    public async Task<IActionResult> SupprimerFilm(int id, [FromBody] string filmId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour supprimer un film d'une liste." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        var listeFilms = await _context.ListesFilms.FindAsync(id);

        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (listeFilms.UtilisateurId != userId)
        {
            return Forbid();
        }

        if (!listeFilms.SupprimerFilm(filmId))
        {
            return BadRequest("Film non trouvé dans la liste.");
        }

        await _context.SaveChangesAsync();
        return Ok("Film supprimé de la liste avec succès.");
    }
}
