using Microsoft.AspNetCore.Mvc;
using test.Models;
using static test.Controllers.TaskController.MasterDataController;

namespace test.Controllers.TaskController
{
  [Route("api/task/list/[controller]")]
  [ApiController]
  public class ListController : Controller
  {
    private readonly DataContext _context;
    public ListController(DataContext context)
    {
      _context = context;
    }

    [HttpGet]
    public async Task<dynamic> GetTaskList()
    {
      return null;
    }
  }
}
