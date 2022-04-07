using JBS_API.DB_Models;
using Microsoft.EntityFrameworkCore;

namespace JBS_API
{
    public class DbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Ad> Ads { get; set; }

        public DbContext(DbContextOptions<DbContext> options)
            : base(options)
        {
           // Database.EnsureDeleted();
            Database.EnsureCreated();
        }

    }
}
