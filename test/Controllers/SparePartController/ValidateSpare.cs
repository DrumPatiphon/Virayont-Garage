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
      public int SpareId { get; set; }
    }

    [HttpGet]
    public async Task<Boolean> ValidateResult([FromQuery] SpareRequest request)
    {
      var data = await (from dt in _context.Set<Dbtask>()
                        join s in _context.Set<TaskDetail>() on dt.task_id equals s.task_id
<<<<<<< HEAD
                        where s.spare_id == request.SpareId
=======
                        where s.spare_id== request.SpareId
>>>>>>> develop
                        select new
                        {
                          spareId = s.spare_id
                        }).ToListAsync();

      if(data.Count > 0)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  }
}
