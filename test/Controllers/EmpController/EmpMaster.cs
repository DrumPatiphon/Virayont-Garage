using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.EmpController
{
  [Route("api/emp/[controller]")]
  [ApiController]
  public class EmpMaster : ControllerBase
  {
    private readonly DataContext _context;

    public EmpMaster(DataContext context)
    {
      _context = context;
    }
    public class EmpMasterData
    {
      public IEnumerable<dynamic> PositionData { get; set; }
    }

    [HttpGet]
    public async Task<EmpMasterData> GetMasterData()
    {
      EmpMasterData masterData = new EmpMasterData();
      masterData.PositionData = await GetPositionData();
 
      return masterData;
    }

    private async Task<IEnumerable<dynamic>> GetPositionData()
    {
      var positions = await (from d in _context.Set<Department>()
                             select new
                             {
                               Value = d.department_id,
                               Text = string.Concat(d.department_id, " : ", d.department_name),
                             }).ToListAsync();

      return positions;
    }

  }
}
