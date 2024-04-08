using Microsoft.AspNetCore.Mvc;
using test.Models;

namespace test.Controllers.TaskController
{
  [Route("api/task/[controller]")]
  [ApiController]
  public class Create : Controller
  {
    private readonly DataContext _context;
    public Create(DataContext context)
    {
      _context = context;
    }

    public class Request : Dbtask
    {
      public new IEnumerable<TaskDetailDto> TaskDetail { get; set; }
    }

    public class TaskDetailDto : TaskDetail
    {
      public string RowState { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult> AddDbtask(Request request)
    {

      DateTime currentDate = DateTime.Now;
      string formattedDate = currentDate.ToString("yyyyMM");
      Random random = new Random();
      int runningDoc = random.Next(100, 1000);

      Dbtask dbTask = new Dbtask();
      dbTask = request;
      dbTask.task_no = "TN" + formattedDate + runningDoc;
      dbTask.status = "SAVED";
      dbTask.task_amt = request.task_amt;
      this._context.dbtask.Add(dbTask);

      foreach(TaskDetail detail in request.TaskDetail)
      {
        detail.detail_qty = detail.detail_qty;
        this._context.task_detail.Add(detail);
      }

      await this._context.SaveChangesAsync();
      return Ok(dbTask.task_id);
    }
  }
}
