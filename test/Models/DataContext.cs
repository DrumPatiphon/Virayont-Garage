using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace test.Models
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));
        }

        public DbSet<Customer> customer { get; set; }
        public DbSet<Employee> employee { get; set; }
        public DbSet<Spare_part> spare_part { get; set; }
        public DbSet<Department> department { get; set; }
        public DbSet<Spare4Task> Spare4Task { get; set; }
        public DbSet<Spare_type> spare_type { get; set; }
        public DbSet<Dbtask> dbtask { get; set; }
        public DbSet<Vehicle> vehicle { get; set; }
    }
}
