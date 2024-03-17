using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
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
      masterData.CustomerData = await _context.QueryAsync(GetCustomerData());

      return masterData;
    }

    private string GetCustomerData()
    {
      StringBuilder sql = new StringBuilder();
      sql.AppendLine(" SELECT  ");
      sql.AppendLine(" customer_id                                                  AS \"value\",       ");
      sql.AppendLine(" CONCAT(c.customer_id,' : ',c.first_name , ' ', c.last_name ) AS \"text\",        ");
      sql.AppendLine(" c.company_name	                                              AS \"companyName\", ");
      sql.AppendLine(" c.address		                                                AS \"address\",     ");
      sql.AppendLine(" c.phone_number	                                              AS \"phoneNumber\"  ");
      sql.AppendLine(" FROM public.customer c  ");
      return sql.ToString();
    }
  }
}
