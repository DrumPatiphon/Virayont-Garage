using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CustomerController : ControllerBase
  {
    private readonly DataContext _context;

    public CustomerController(DataContext context)
    {
      this._context = context;
    }
    public class Search
    {
      public int customer_id { get; set; }
      public string? phone_number { get; set; }
      public string? county_name { get; set; }
    }
    [HttpPost("getlist")]
    public async Task<ActionResult> GetList([FromQuery] Search request)
    {
      List<Customer> customer = new List<Customer>();
      if (request.customer_id != 0 && request.customer_id != null) customer = this._context.customer.Where(w => w.customer_id == request.customer_id).ToList();
      else if (!String.IsNullOrEmpty(request.phone_number)) customer = this._context.customer.Where(w => w.phone_number == request.phone_number).ToList();
      else if (!String.IsNullOrEmpty(request.county_name)) customer = this._context.customer.Where(w => w.county_name == request.county_name).ToList();

      else customer = this._context.customer.ToList();

      return Ok(customer);
    }
    [HttpGet]
    public async Task<ActionResult> GetList(int customerid)
    {
      List<Customer> customer = this._context.customer.Where(w => w.customer_id == customerid).ToList();
      return Ok(customer);
    }
    [HttpGet("getall")]
    public async Task<ActionResult> GetList()
    {
      List<Customer> customer = this._context.customer.ToList();
      return Ok(customer);
    }
    // [httpget("test")]
    // public async task<actionresult> getlist1()
    // {
    //list<customer> customer = this._context.customer.tolist();
    //    return ok(customer);
    // } //ctrl+k+u
    [HttpPost]
    public async Task<ActionResult> AddCustomer(Customer customer)
    {
      this._context.customer.Add(customer);
      await this._context.SaveChangesAsync();
      return Ok(customer);
    }
    [HttpPut]
    public async Task<ActionResult> EditCustomer(Customer customer)
    {
      this._context.customer.Attach(customer);
      this._context.Entry(customer).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
      await this._context.SaveChangesAsync();
      return Ok(customer);
    }
    [HttpDelete]
    public async Task<ActionResult> DeleteCustomer(int customerId)
    {
      Customer customer = this._context.customer.Where(w => w.customer_id == customerId).FirstOrDefault();
      this._context.customer.Remove(customer);
      await this._context.SaveChangesAsync();
      return Ok(customer);
    }
  }
}


