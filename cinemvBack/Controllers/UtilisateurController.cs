using cinemvBack.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

[ApiController]
[Route("api/utilisateur")]
public class UtilisateurController : ControllerBase
{
    private readonly cinemvBackContext _context;

    public UtilisateurController(cinemvBackContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UtilisateurDTO>>> GetUtilisateurs()
    {
        var utilisateurs = _context.Utilisateurs.Select(x => new UtilisateurDTO(x));
        return await utilisateurs.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UtilisateurDTO>> GetUtilisateur(int id)
    {
        var utilisateur = await _context.Utilisateurs.SingleOrDefaultAsync(t => t.Id == id);

        if (utilisateur == null)
            return NotFound("Utilisateur non trouvé.");

        return new UtilisateurDTO(utilisateur);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDTO registerDTO)
    {
        if (
            await _context.Utilisateurs.AnyAsync(u =>
                u.Email == registerDTO.Email || u.NomUtilisateur == registerDTO.NomUtilisateur
            )
        )
        {
            return BadRequest("Cet utilisateur existe déjà.");
        }

        var utilisateur = Utilisateur.FromDto(registerDTO);

        _context.Utilisateurs.Add(utilisateur);
        await _context.SaveChangesAsync();

        return Ok("Utilisateur inscrit avec succès.");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO loginDTO)
    {
        var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u =>
            u.Email == loginDTO.Email
        );

        if (utilisateur == null || !utilisateur.VerifyPassword(loginDTO.MotDePasse))
        {
            return Unauthorized("Email ou mot de passe incorrect.");
        }

        return Ok(
            new
            {
                Message = "Connexion réussie.",
                Utilisateur = new
                {
                    utilisateur.Id,
                    utilisateur.NomUtilisateur,
                    utilisateur.Email,
                },
            }
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateUtilisateurDTO updateUtilisateurDTO)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);

        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé");
        }

        utilisateur.UpdateFromDTO(updateUtilisateurDTO);

        _context.Utilisateurs.Update(utilisateur);
        await _context.SaveChangesAsync();

        return Ok("Utilisateur mis à jour avec succès");
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var utilisateur = await _context.Utilisateurs.FindAsync(id);

        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }

        _context.Utilisateurs.Remove(utilisateur);
        await _context.SaveChangesAsync();

        return Ok("Utilisateur supprimé avec succès.");
    }
}
