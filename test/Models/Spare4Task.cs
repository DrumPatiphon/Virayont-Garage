using System.ComponentModel.DataAnnotations;

namespace test.Models
{
    public class Spare4Task
    {
        [Key]
        public int detail_id { get; set; }
        public int? task_id { get; set; }
        public int? spare_id { get; set; }
    }
}
