using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using test.Models;

namespace test.Controllers.SparePartController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class SpareDetail : Controller
  {
    private readonly DataContext _context;
    public SpareDetail(DataContext context)
    {
      _context = context;
    }

    public class Request
    {
      public int spare_id { get; set; }
    }

    [HttpGet("{spareId}")]
    public async Task<ActionResult<SparePart>> GetDbTaskById(int spareId)
    {

      var sparePart = await GetSpareById(spareId);

      if (sparePart == null)
      {
        return NotFound();
      }

      return sparePart;
    }

    private async Task<SparePart> GetSpareById(int spareId)
    {

      var spartPart = await (from sp in _context.Set<SparePart>()
                          where  sp.spare_id == spareId
                          select sp).SingleOrDefaultAsync();
      return spartPart;
    }
  }
}
