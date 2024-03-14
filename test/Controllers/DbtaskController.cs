using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Threading.Tasks;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DbtaskController : ControllerBase
    {
        private readonly DataContext _context;

        public DbtaskController(DataContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetList()
        {
            List<Dbtask> dbtask = this._context.dbtask.ToList();
            return Ok(dbtask);
        }
        [HttpPost]
        public async Task<ActionResult> AddDbtask(Dbtask dbtask)
        {
            this._context.dbtask.Add(dbtask);
            await this._context.SaveChangesAsync();
            return Ok(dbtask);
        }
        [HttpPut]
        public async Task<ActionResult> EditDbtask(Dbtask dbtask)
        {
            this._context.dbtask.Attach(dbtask);
            this._context.Entry(dbtask).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await this._context.SaveChangesAsync();
            return Ok(dbtask);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteDbtask(int dbtaskId)
        {
            Dbtask dbtask = this._context.dbtask.Where(w => w.task_id == dbtaskId).FirstOrDefault();
            this._context.dbtask.Remove(dbtask);
            await this._context.SaveChangesAsync();
            return Ok(dbtask);
        }
    }
}
