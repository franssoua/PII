using System.Security.Claims;
using cinemvBack.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace cinemvBack.Controllers;

[ApiController]
[Route("api/utilisateur")]
public class UtilisateurController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly ILogger<UtilisateurController> _logger;
    private readonly cinemvBackContext _context;

    public UtilisateurController(
        JwtService jwtService,
        ILogger<UtilisateurController> logger,
        cinemvBackContext context
    )
    {
        _jwtService = jwtService;
        _logger = logger;
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

    [HttpGet("isadmin")]
    [Authorize]
    public IActionResult IsAdmin()
    {
        var isAdmin = User.IsInRole("Admin");
        return Ok(new { isAdmin });
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
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginDTO loginDTO)
    {
        if (loginDTO == null)
        {
            return BadRequest("La requête ne peut pas être nulle.");
        }

        try
        {
            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u =>
                u.Email == loginDTO.Email
            );

            if (utilisateur == null)
            {
                return Unauthorized("Identifiants invalides.");
            }

            if (!utilisateur.VerifyPassword(loginDTO.Password))
            {
                return Unauthorized("Identifiants invalides.");
            }

            var token = _jwtService.GenerateToken(utilisateur);

            return Ok(new AuthResponse { Token = token, Utilisateur = utilisateur });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la connexion.");
            return StatusCode(500, "Erreur interne du serveur.");
        }
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdateUtilisateurDTO updateUtilisateurDTO)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour modifier votre compte." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        if (userId != id && !isAdmin)
        {
            return Forbid(
                "Vous n'avez pas la permission de modifier les informations de cet utilisateur."
            );
        }

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
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        var isAdmin = User.IsInRole("Admin");

        if (userIdClaim == null)
        {
            return Unauthorized(
                new { message = "Vous devez être connecté pour supprimer votre compte." }
            );
        }

        int userId = int.Parse(userIdClaim.Value);
        if (userId != id && !isAdmin)
        {
            return Forbid("Vous n'avez pas la permission de supprimer cet utilisateur.");
        }

        var utilisateur = await _context
            .Utilisateurs.Include(u => u.Listes) // Inclure les films liés à l'utilisateur
            .Include(u => u.Abonnements) // Inclure les abonnements
            .FirstOrDefaultAsync(u => u.Id == id);

        if (utilisateur == null)
        {
            return NotFound("Utilisateur non trouvé.");
        }

        var abonnements = await _context
            .Utilisateurs.Where(u => u.Abonnements.Contains(utilisateur))
            .ToListAsync();

        foreach (var abonne in abonnements)
        {
            abonne.Abonnements.Remove(utilisateur);
            _context.Utilisateurs.Update(abonne);
        }

        var listesFilms = await _context
            .ListesFilms.Where(l => l.UtilisateurId == id)
            .ToListAsync();

        _context.ListesFilms.RemoveRange(listesFilms);

        _context.Utilisateurs.Remove(utilisateur);
        await _context.SaveChangesAsync();

        return Ok("Utilisateur supprimé avec succès.");
    }
}
