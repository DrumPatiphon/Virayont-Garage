using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly DataContext _context;

        public DepartmentController(DataContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetList()
        {
            List<Department> department = this._context.department.ToList();
            return Ok(department);
        }
        [HttpPost]
        public async Task<ActionResult> AddDepartment(Department department)
        {
            this._context.department.Add(department);
            await this._context.SaveChangesAsync();
            return Ok(department);
        }
        [HttpPut]
        public async Task<ActionResult> EditDepartment(Department department)
        {
            this._context.department.Attach(department);
            this._context.Entry(department).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await this._context.SaveChangesAsync();
            return Ok(department);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteDepartment(int departmentId)
        {
            Department department = this._context.department.Where(w => w.department_id == departmentId).FirstOrDefault();
            this._context.department.Remove(department);
            await this._context.SaveChangesAsync();
            return Ok(department);
        }

    }
}
