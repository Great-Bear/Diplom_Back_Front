using JBS_API.DB_Models;
using Microsoft.EntityFrameworkCore;

namespace JBS_API
{
    public class DbContext : Microsoft.EntityFrameworkCore.DbContext
    {
        public DbSet<TypeOwner> TypeOwners { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<User> Users { get; set; }


        public DbSet<QualityAd> QualityAds { get; set; }
        public DbSet<Ad> Ads { get; set; }
        public DbSet<StatusAd> StatusAds { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Layer1_Category> Layer1_Category { get; set; }
        public DbSet<Layer2_Category> Layer2_Category { get; set; }

        public DbSet<FilterName> FilterNames { get; set; }
        public DbSet<TypeFilter> TypeFilters { get; set; }
        public DbSet<Filter> Filters { get; set; }
        public DbSet<FilterValue> FilterValues { get; set; }
        public DbSet<Filter_Ad> Filter_Ad { get; set; }

        public DbSet<Currency> Currencies { get; set; }


        public DbSet<Brend> Brends { get; set; }
        public DbSet<VipAd> VipAds { get; set; }
        public DbSet<Img> Imgs { get; set; }

        public DbContext(DbContextOptions<DbContext> options)
            : base(options)
        {
            Database.EnsureCreated();     
        }

        public void RefreshDb()
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();
        }


    }
}
