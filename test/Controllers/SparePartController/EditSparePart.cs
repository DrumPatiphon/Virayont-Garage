using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity.Infrastructure;
using System.Threading;
using test.Models;

namespace test.Controllers.SparePartController
{
  [Route("api/spare/[controller]")]
  [ApiController]
  public class EditSparePart : Controller
  {
    private readonly DataContext _context;
    public EditSparePart(DataContext context)
    {
      _context = context;
    }

    public class SparePartDto : SparePart
    {
      public string Action { get; set; }
    }

    [HttpPut]
    public async Task<ActionResult> AttachSparePart(SparePartDto EditRequest)
    {
      SparePart sparePart = new SparePart();
      sparePart = EditRequest;
      if(EditRequest.Action == "Save")
      {
        this._context.Set<SparePart>().Attach(sparePart);
        this._context.Entry(sparePart).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
      }
      else if(EditRequest.Action == "Delete")
      {
        this._context.Set<SparePart>().Remove(sparePart);
        this._context.Entry(sparePart).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
      }
      await this._context.SaveChangesAsync();
      return Ok(sparePart.spare_id);
    }
  }
}
