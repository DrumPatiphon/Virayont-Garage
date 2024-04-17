using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.EmpController
{
  [Route("api/emp/[controller]")]
  [ApiController]
  public class CreateEmp : Controller
  {
    private readonly DataContext _context;
    public CreateEmp(DataContext context)
    {
      _context = context;
    }

    [HttpPost]
    public async Task<ActionResult> AddSparePart(Employee request)
    {
      Employee employee = await _context.Set<Employee>().OrderByDescending(o => o.employee_id).FirstOrDefaultAsync();
      request.employee_id = employee.employee_id + 1;
      this._context.Set<Employee>().Add(request);
      await this._context.SaveChangesAsync();
      return Ok(request.employee_id);
    }
  }
}
