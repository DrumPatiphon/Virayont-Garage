using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.SparePartController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class CreateSparePart : Controller
  {
    private readonly DataContext _context;
    public CreateSparePart(DataContext context)
    {
      _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> AddSparePart(SparePart request)
    {
      SparePart spare = await _context.Set<SparePart>().OrderByDescending(o => o.spare_id).FirstOrDefaultAsync();
      request.spare_id = spare.spare_id + 1;
      this._context.Set<SparePart>().Add(request);
      await this._context.SaveChangesAsync();
      return Ok(request.spare_id);
    }
  }
}
