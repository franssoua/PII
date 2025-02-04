using cinemvBack.Models;
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

    [HttpPost]
    public async Task<IActionResult> CreateList(ListeFilmsDTO listeFilmsDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(listeFilmsDTO.UtilisateurId);
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
    public async Task<IActionResult> UpdateList(int id, [FromBody] ListeFilmsDTO listeFilmsDTO)
    {
        var listeFilms = await _context.ListesFilms.FindAsync(id);
        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        listeFilms.ModifierListe(listeFilmsDTO.Titre, listeFilmsDTO.Description);
        await _context.SaveChangesAsync();

        return Ok("Liste mise à jour avec succès."); //essayer après avec Ok("Liste modifiée avec succès.")
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteList(int id)
    {
        var listeFilms = await _context.ListesFilms.FindAsync(id);
        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        _context.ListesFilms.Remove(listeFilms);
        await _context.SaveChangesAsync();

        return Ok("Liste supprimée avec succès.");
    }

    [HttpPost("{id}/ajouterFilm")]
    public async Task<IActionResult> AjouterFilm(int id, [FromBody] string filmId)
    {
        var listeFilms = await _context.ListesFilms.FindAsync(id);
        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (!listeFilms.AjouterFilm(filmId))
        {
            return BadRequest("Ce film est déjà dans cette liste.");
        }

        await _context.SaveChangesAsync();
        return Ok("Film ajouté à la liste avec succès.");
    }

    [HttpPost("{id}/supprimerFilm")]
    public async Task<IActionResult> SupprimerFilm(int id, [FromBody] string filmId)
    {
        var listeFilms = await _context.ListesFilms.FindAsync(id);
        if (listeFilms == null)
        {
            return NotFound("Liste non trouvée.");
        }

        if (!listeFilms.SupprimerFilm(filmId))
        {
            return BadRequest("Film non trouvé dans la liste.");
        }

        await _context.SaveChangesAsync();
        return Ok("Film supprimé de la liste avec succès.");
    }
}
