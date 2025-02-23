using cinemvBack.Models;

public class AuthResponse
{
    public required string Token { get; set; }
    public required Utilisateur Utilisateur { get; set; }
}
