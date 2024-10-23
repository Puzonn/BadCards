using BadCards.Api.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace BadCards.Api.Database;

public class BadCardsContext : DbContext
{
    public DbSet<CardDb> Cards { get; set; }
    public DbSet<RoomDb> Rooms { get; set; }
    public DbSet<UserDb> Users { get; set; }
    public DbSet<CardTranslationDb> CardTranslations { get; set; }

    private readonly IConfiguration _configuration;

    public BadCardsContext(IConfiguration configuration)
    {
        _configuration = configuration;

        Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(_configuration.GetConnectionString("Default"));
    }
}
