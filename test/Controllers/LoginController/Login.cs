using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.LoginController
{
  [Route("api/[controller]")]
  [ApiController]
  public class Login : Controller
  {
    private readonly DataContext _context;
    public Login(DataContext context)
    {
      _context = context;
    }

    public class LoginRequest
    {
      public string phoneNumber { get; set; }
      public string? password { get; set; }
      public bool empCheckBox { get; set; }
    }

    public class LoginResult
    {
      public int? userId { get; set; }
      public string? userRole { get; set; }
      public string? phoneNumber { get; set; }
      public string? taskPhone { get; set; }
    }

    [HttpGet]
    public async Task<IEnumerable<LoginResult>> GetUser([FromQuery] LoginRequest request)
    {
      dynamic user;

      if (request.empCheckBox)
      {
        user = await (from e in _context.Set<Employee>()
                      join d in _context.Set<Department>() on e.department_id equals d.department_id
                      where e.empphone_number == request.phoneNumber
                         && e.password == request.password
                      select new LoginResult
                      {
                        userId = e.employee_id,
                        userRole = d.department_name,
                        phoneNumber = e.empphone_number,
                        taskPhone = "",
                      }).Take(1).ToListAsync();
      }
      else
      {
        user = await (from c in _context.Set<Customer>()
                      join t in _context.Set<Dbtask>() on c.customer_id equals t.customer_id into cus_join
                      from ct in cus_join.DefaultIfEmpty()
                      where ct.customer_phone == request.phoneNumber || c.phone_number == request.phoneNumber
                      select new LoginResult
                      {
                        userId = c.customer_id,
                        userRole = "customer",
                        phoneNumber = c.phone_number,
                        taskPhone = ct.customer_phone,
                      }).Take(1).ToListAsync();
      }

      return user;
    }
  }
}
