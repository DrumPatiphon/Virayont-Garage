using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using test.Models;

namespace test.Controllers.SparePartController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class SpareList : Controller
  {
    private readonly DataContext _context;
    public SpareList(DataContext context)
    {
      _context = context;
    }

    public class Request
    {
      public int? SpareId { get; set; }
      public string? SpareName { get; set; }
      public int? SpareTypeId { get; set; }
    }

    [HttpGet]
    public async Task<IEnumerable<dynamic>> GetSearchList([FromQuery] Request request)
    {
      var listResult = await (from sp in _context.Set<SparePart>()
                              select new
                              {
                                spareId = sp.spare_id,
                                spareName = sp.spare_name,
                                spareTypeId = sp.sparetype_id,
                                quantity = sp.quantity,
                                sparePrice = sp.spare_price,
                              }).OrderByDescending(o => o.spareId).ToListAsync();

      if (request.SpareId != null)
      {
        listResult = listResult.Where(o => o.spareId == request.SpareId).ToList();
      }

      if (request.SpareName != null)
      {
        listResult = listResult.Where(o => o.spareName.ToLower().Contains(request.SpareName.ToLower())).ToList();
      }

      if (request.SpareTypeId != null)
      {
        listResult = listResult.Where(o => o.spareTypeId == request.SpareTypeId).ToList();
      }

      return listResult;
    }
  }
}
