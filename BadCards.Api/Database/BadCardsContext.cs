using BadCards.Api.Models.Database;
using BadCards.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace BadCards.Api.Database;

public class BadCardsContext : DbContext
{
    public DbSet<CardDb> Cards { get; set; }
    public DbSet<RoomDb> Rooms { get; set; }
    public DbSet<UserDb> Users { get; set; }
    public DbSet<CardTranslationDb> CardTranslations { get; set; }

    private readonly IConfiguration configuration;

    public BadCardsContext(IConfiguration _configuration)
    {
        configuration = _configuration;

        Database.EnsureCreated();
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(configuration.GetConnectionString("Default"));
    }
}
