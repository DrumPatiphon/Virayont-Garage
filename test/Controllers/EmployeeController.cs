using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly DataContext _context;

        public EmployeeController(DataContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetList()
        {
            List<Employee> employee = this._context.employee.ToList();
            return Ok(employee);
        }
        [HttpPost]
        public async Task<ActionResult> AddEmployee(Employee employee)
        {
            this._context.employee.Add(employee);
            await this._context.SaveChangesAsync();
            return Ok(employee);
        }
        [HttpPut]
        public async Task<ActionResult> EditEmployee(Employee employee)
        {
            this._context.employee.Attach(employee);
            this._context.Entry(employee).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await this._context.SaveChangesAsync();
            return Ok(employee);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteEmployee(int employeeId)
        {
            Employee employee = this._context.employee.Where(w => w.employee_id == employeeId).FirstOrDefault();
            this._context.employee.Remove(employee);
            await this._context.SaveChangesAsync();
            return Ok(employee);
        }
    }
}