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
        [HttpGet]
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
    

