using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.TaskController
{
  [Route("api/task/[controller]")]
  [ApiController]
  public class MasterDataController : ControllerBase
  {
    public class MasterData
    {
      public IEnumerable<dynamic> CustomerData { get; set; }
      public IEnumerable<dynamic> Status { get; set; }
    }

    private readonly DataContext _context;

    public MasterDataController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<MasterData> GetMasterData()
    {
      MasterData masterData = new MasterData();
      masterData.CustomerData = await GetCustomerData();
      masterData.Status = await GetStatus();

      return masterData;
    }

    private async Task<IEnumerable<dynamic>> GetCustomerData()
    {
      var customers = await (from c in _context.Set<Customer>()
                             select new 
                             {
                               Value = c.customer_id,
                               Text = string.Concat(c.customer_id, " : ", c.first_name, " ", c.last_name),
                               CompanyName = c.company_name,
                               Address = c.address,
                               PhoneNumber = c.phone_number
                             }).ToListAsync();

      return customers;
    }

    private async Task<IEnumerable<dynamic>> GetStatus()
    {
      var status = await (from s in _context.Set<Status>()
                          select new
                          {
                            Value = s.status_id,
                            Text = s.status_desc
                          }).ToListAsync();
      return status;
    }


  }
}