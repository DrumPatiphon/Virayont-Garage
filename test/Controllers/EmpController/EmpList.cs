using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using test.Models;

namespace test.Controllers.EmpController
{
  [Route("api/emp/[controller]")]
  [ApiController]
  public class EmpList : Controller
  {
    private readonly DataContext _context;
    public EmpList(DataContext context)
    {
      _context = context;
    }

    public class EmpRequest
    {

    }

    [HttpGet]
    public async Task<IEnumerable<dynamic>> GetEmpList([FromQuery] EmpRequest request)
    {
      var listResult = await (from e in _context.Set<Employee>()
                              join p in _context.Set<Department>() on e.department_id equals p.department_id
                              select new
                              {
                                empId = e.employee_id,
                                empName = string.Concat(    e.empfirst_name, " ", e.emplast_name),
                                salary = e.salary,
                                position = p.department_name,
                              }).OrderBy(o => o.empId).ToListAsync();

      return listResult;
    }
  }
}
