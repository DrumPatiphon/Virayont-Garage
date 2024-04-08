using System.ComponentModel.DataAnnotations;

namespace test.Models
{
    public class TaskDetail
    {
    [Key]
    public int seq { get; set; }
    public int? detail_id { get; set; }
    public int task_id { get; set; }
    public int spare_id { get; set; }
    public string spare_desc { get; set; }
    public decimal? detail_qty { get; set; }
    public decimal? detail_unit_price { get; set; }
    public decimal? detail_amt { get; set; }
    public string detail_description { get; set; }
    public string create_by { get; set; }
    public DateTime? create_date { get; set; }
    public DateTime? update_date { get; set; }

  }
}
