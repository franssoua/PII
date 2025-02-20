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
        var notes = await _context.Notes.Where(a => a.FilmId == filmId).ToListAsync();
        if (notes.Count == 0)
        {
            return NotFound("Ce film n'a aucun avis pour le moment.");
        }
        var noteDTO = notes.Select(a => new NoteDTO(a)).ToList();

        return Ok(noteDTO);
    }

    [HttpGet("utilisateur/{utilisateurId}")]
    public async Task<IActionResult> GetNotessByUtilisateur(int utilisateurId)
    {
        var notes = await _context.Notes.Where(a => a.UtilisateurId == utilisateurId).ToListAsync();
        if (notes.Count == 0)
        {
            return NotFound("Cet utilisateur n'a posté aucun commentaires.");
        }
        var noteDTO = notes.Select(a => new NoteDTO(a)).ToList();

        return Ok(noteDTO);
    }

    [HttpPost]
    public async Task<IActionResult> AjouterNote(NoteDTO noteDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(noteDTO.UtilisateurId);
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
    public async Task<IActionResult> ModifierNote(int id, NoteDTO noteDTO)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return NotFound("Note introuvable.");
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
    public async Task<IActionResult> SupprimerNote(int id)
    {
        var note = await _context.Notes.FindAsync(id);
        if (note == null)
        {
            return NotFound("Note introuvable.");
        }

        _context.Notes.Remove(note);
        await _context.SaveChangesAsync();

        return Ok("Note supprimée avec succès");
    }
}
