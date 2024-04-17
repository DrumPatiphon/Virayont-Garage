using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Spare_typeController : ControllerBase
    {
        private readonly DataContext _context;

        public Spare_typeController(DataContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetList()
        {
            List<SpareType> spare_type = this._context.spare_type.ToList();
            return Ok(spare_type);
        }
        [HttpPost]
        public async Task<ActionResult> AddSpare_type(SpareType spare_type)
        {
            this._context.spare_type.Add(spare_type);
            await this._context.SaveChangesAsync();
            return Ok(spare_type);
        }
        [HttpPut]
        public async Task<ActionResult> EditSpare_type(SpareType spare_type)
        {
            this._context.spare_type.Attach(spare_type);
            this._context.Entry(spare_type).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await this._context.SaveChangesAsync();
            return Ok(spare_type);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteSpare_type(int sparetypeId)
        {
            SpareType spare_type = this._context.spare_type.Where(w => w.sparetype_id == sparetypeId).FirstOrDefault();
            this._context.spare_type.Remove(spare_type);
            await this._context.SaveChangesAsync();
            return Ok(spare_type);
        }
    }
}
