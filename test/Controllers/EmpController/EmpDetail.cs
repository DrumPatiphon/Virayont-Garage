using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using test.Models;

namespace test.Controllers.EmpController
{
  [Route("api/emp/[controller]")]
  [ApiController]
  public class EmpDetail : Controller
  {
    private readonly DataContext _context;
    public EmpDetail(DataContext context)
    {
      _context = context;
    }

    public class Request
    {
      public int employee_id { get; set; }
    }

    [HttpGet("{empId}")]
    public async Task<ActionResult<Employee>> GetDbTaskById(int empId)
    {

      var emp = await GetCusById(empId);

      if (emp == null)
      {
        return NotFound();
      }

      return emp;
    }

    private async Task<Employee> GetCusById(int empId)
    {

      var emp = await (from e in _context.Set<Employee>()
                          where  e.employee_id == empId
                            select e).SingleOrDefaultAsync();
      return emp;
    }
  }
}
