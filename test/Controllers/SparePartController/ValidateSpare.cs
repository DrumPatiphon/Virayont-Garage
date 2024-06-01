using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.SpareController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class ValidateSpare : Controller
  {
    private readonly DataContext _context;
    public ValidateSpare(DataContext context)
    {
      _context = context;
    }

    public class SpareRequest
    {
      public int spare_id { get; set; }
    }

    [HttpGet]
    public async Task<dynamic> ValidateResult([FromQuery] SpareRequest request)
    {
      var data = await (from dt in _context.Set<Dbtask>()
                        join s in _context.Set<TaskDetail>() on dt.task_id equals s.task_id
                        where dt.status != "CANCELLED" && s.spare_id== request.spare_id
                        select new
                        {
                          spareId = s.spare_id
                        }).ToListAsync();

      return data;
    }
  }
}
