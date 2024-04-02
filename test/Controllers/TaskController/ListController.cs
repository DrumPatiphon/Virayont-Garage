using Microsoft.AspNetCore.Mvc;

namespace test.Controllers.TaskController
{
  public class ListController : Controller
  {
    public IActionResult Index()
    {
      return View();
    }
  }
}
