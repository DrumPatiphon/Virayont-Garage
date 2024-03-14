using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly DataContext _context;

        public VehicleController(DataContext context)
        {
            this._context = context;
        }
        [HttpGet]
        public async Task<ActionResult> GetList()
        {
            List<Vehicle> vehicle = this._context.vehicle.ToList();
            return Ok(vehicle);
        }
        [HttpPost]
        public async Task<ActionResult> AddVehicle(Vehicle vehicle)
        {
            this._context.vehicle.Add(vehicle);
            await this._context.SaveChangesAsync();
            return Ok(vehicle);
        }
        [HttpPut]
        public async Task<ActionResult> EditVehicle(Vehicle vehicle)
        {
            this._context.vehicle.Attach(vehicle);
            this._context.Entry(vehicle).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            await this._context.SaveChangesAsync();
            return Ok(vehicle);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteVehicle(int vehicleId)
        {
            Vehicle vehicle = this._context.vehicle.Where(w => w.vehicle_id == vehicleId).FirstOrDefault();
            this._context.vehicle.Remove(vehicle);
            await this._context.SaveChangesAsync();
            return Ok(vehicle);
        }
    }
}


