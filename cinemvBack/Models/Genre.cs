public class Genre
{
    public int Id { get; set; }
    public string Nom { get; set; } = null!;
    public ICollection<string>? FilmsIds { get; set; }

    public Genre() { }
}
