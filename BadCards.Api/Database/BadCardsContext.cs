using BadCards.Api.Models.Database;
using Microsoft.EntityFrameworkCore;

namespace BadCards.Api.Database;

public class BadCardsContext : DbContext
{
    public DbSet<CardDb> Cards { get; set; }
    public DbSet<RoomDb> Rooms { get; set; }
    public DbSet<UserDb> Users { get; set; }
    public DbSet<CardTranslationDb> CardTranslations { get; set; }

    protected readonly IConfiguration Configuration;

    public BadCardsContext(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite(Configuration.GetConnectionString("Default"));
    }
}
