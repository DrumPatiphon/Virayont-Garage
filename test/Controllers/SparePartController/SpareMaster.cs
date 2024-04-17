using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.SparePartController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class SpareMaster : ControllerBase
  {
    private readonly DataContext _context;

    public SpareMaster(DataContext context)
    {
      _context = context;
    }
    public class SpareMasterData
    {
      public IEnumerable<dynamic> SpareData { get; set; }
      public IEnumerable<dynamic> SpareType { get; set; }
    }

    [HttpGet]
    public async Task<SpareMasterData> GetMasterData()
    {
      SpareMasterData masterData = new SpareMasterData();
      masterData.SpareData = await GetSpareData();
      masterData.SpareType = await GetSpareType();


      return masterData;
    }

    private async Task<IEnumerable<dynamic>> GetSpareData()
    {
      var spareData = await (from s in _context.Set<SparePart>()
                            orderby s.spare_id
                            select new
                            {
                              Value = s.spare_id,
                              Text = string.Concat(s.spare_id, " : ", s.spare_name),
                              SpareName = s.spare_name,
                              SparePrice = s.spare_price,
                              SpareQty = s.quantity,
                            }).ToListAsync();
      return spareData;
    }

    private async Task<IEnumerable<dynamic>> GetSpareType()
    {
      var spareType = await (from s in _context.Set<SpareType>()
                             orderby s.sparetype_id
                             select new
                             {
                               Value = s.sparetype_id,
                               Text = string.Concat(s.sparetype_id, " : ", s.sparetype_name),
                             }).ToListAsync();
      return spareType;
    }

  }
}
