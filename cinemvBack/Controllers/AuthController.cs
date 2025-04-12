using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// Contrôleur d’authentification simplifiée pour générer un JWT
[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly JwtService _jwtService;
    private readonly ILogger<AuthController> _logger;
    private readonly cinemvBackContext _context;

    public AuthController(
        JwtService jwtService,
        ILogger<AuthController> logger,
        cinemvBackContext context
    )
    {
        _jwtService = jwtService;
        _logger = logger;
        _context = context;
    }

    //Route pour vérifier si l'utilisateur est admin
    [HttpGet("isadmin")]
    [Authorize]
    public IActionResult IsAdmin()
    {
        var isAdmin = User.IsInRole("Admin");
        return Ok(new { isAdmin });
    }

    //Route pour authentifier un utilisateur et générer un token JWT
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] AuthRequest request)
    {
        if (request == null)
        {
            return BadRequest("La requête ne peut pas être nulle.");
        }

        try
        {
            var utilisateur = await _context.Utilisateurs.FirstOrDefaultAsync(u =>
                u.NomUtilisateur == request.NomUtilisateur
            );

            if (utilisateur == null)
            {
                return Unauthorized("Identifiants invalides.");
            }

            // En production, utilisez un algorithme de hachage pour vérifier le mot de passe (ex. BCrypt)
            if (!utilisateur.VerifyPassword(request.MotDePasse))
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
}
