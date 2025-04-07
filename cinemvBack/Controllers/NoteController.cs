using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/note")]
public class NoteController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public NoteController(cinemvBackContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return NotFound("Note introuvable.");
        }

        return Ok(new NoteDTO(note));
    }

    [HttpGet("film/{filmId}")]
    public async Task<IActionResult> GetNotesByFilm(string filmId)
    {
        var notes = await _context
            .Notes.Include(a => a.Utilisateur)
            .Where(a => a.FilmId == filmId)
            .ToListAsync();

        return Ok(notes.Select(a => new NoteDTO(a)).ToList());
    }

    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<IActionResult> GetNotessByUtilisateur(int utilisateurId)
    {
        var notes = await _context
            .Notes.Include(a => a.Utilisateur)
            .Where(a => a.UtilisateurId == utilisateurId)
            .ToListAsync();
        if (notes.Count == 0)
        {
            return NotFound("Cet utilisateur n'a posté aucune note.");
        }
        var noteDTO = notes.Select(a => new NoteDTO(a)).ToList();

        return Ok(noteDTO);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AjouterNote(NoteDTO noteDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Vous devez être connecté pour poster un avis.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");
        var existingNote = await _context.Notes.FirstOrDefaultAsync(n =>
            n.UtilisateurId == userId && n.FilmId == noteDTO.FilmId
        );

        if (existingNote != null)
        {
            return BadRequest("Vous avez déjà noté ce film.");
        }

        if (noteDTO.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit d'ajouter une note pour un autre utilisateur."
            );
        }
        var utilisateur = await _context.Utilisateurs.FindAsync(userId);
        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }

        if (noteDTO.Valeur < 0 || noteDTO.Valeur > 5)
        {
            return BadRequest("La note doit être comprise entre 0 et 5");
        }

        var note = new Note
        {
            Valeur = noteDTO.Valeur,
            DateCreation = noteDTO.DateCreation,
            UtilisateurId = noteDTO.UtilisateurId,
            FilmId = noteDTO.FilmId,
        };

        _context.Notes.Add(note);
        await _context.SaveChangesAsync();

        return Ok(new NoteDTO(note));
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> ModifierNote(int id, NoteDTO noteDTO)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return NotFound("Note introuvable.");
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Utilisateur non authentifié.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        if (note.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit de modifier cette note."
            );
        }

        if (noteDTO.Valeur < 0 || noteDTO.Valeur > 5)
        {
            return BadRequest("La note doit être comprise entre 0 et 5.");
        }

        note.Valeur = noteDTO.Valeur;
        await _context.SaveChangesAsync();

        return Ok(new NoteDTO(note));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> SupprimerNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return NotFound("Note introuvable.");
        }

        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return Unauthorized("Utilisateur non authentifié.");
        }

        int userId = int.Parse(userIdClaim.Value);
        bool isAdmin = User.IsInRole("Admin");

        if (note.UtilisateurId != userId && !isAdmin)
        {
            return StatusCode(
                StatusCodes.Status403Forbidden,
                "Vous n'avez pas le droit de supprimer cette note."
            );
        }

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();

        return Ok("Note supprimée avec succès");
    }
}
