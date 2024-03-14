using System.ComponentModel.DataAnnotations;

namespace test.Models
{
    public class Vehicle
    {
        [Key]
        public int vehicle_id { get; set; }
        public int customer_id { get; set; }
        public string license_name { get; set; }
    }
}
