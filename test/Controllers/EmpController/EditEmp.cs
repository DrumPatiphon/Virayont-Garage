using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data.Entity.Infrastructure;
using System.Threading;
using test.Models;

namespace test.Controllers.EmpController
{
  [Route("api/emp/[controller]")]
  [ApiController]
  public class EditEmp : Controller
  {
    private readonly DataContext _context;
    public EditEmp(DataContext context)
    {
      _context = context;
    }

    public class EmployeeDto : Employee
    {
      public string Action { get; set; }
    }

    [HttpPut]
    public async Task<ActionResult> AttachSparePart(EmployeeDto EditRequest)
    {
      Employee employee = new Employee();
      employee = EditRequest;
      if(EditRequest.Action == "Save")
      {
        this._context.Set<Employee>().Attach(employee);
        this._context.Entry(employee).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
      }
      else if(EditRequest.Action == "Delete")
      {
        this._context.Set<Employee>().Remove(employee);
        this._context.Entry(employee).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
      }
      await this._context.SaveChangesAsync();
      return Ok(employee.employee_id);
    }
  }
}
