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
      public new IEnumerable<TaskDetail> TaskDetail { get; set; }
    }

    public class TaskDetailDto : TaskDetail
    {
      public string RowState { get; set; }
    }

    [HttpPost]
    public async Task<ActionResult> AddDbtask(Request request)
    {
      DateTime currentDateUtc = DateTime.UtcNow;

      DateTime currentDate = DateTime.Now;
      string formattedDate = currentDate.ToString("yyyyMM");
      Random random = new Random();
      int runningDoc = random.Next(100, 1000);

      Dbtask dbTask = new Dbtask();
      dbTask = request;
      dbTask.task_no = "TN" + formattedDate + runningDoc;
      dbTask.status = "SAVED";
      dbTask.task_amt = request.task_amt;

      //for checking date type null
      dbTask.task_date = request.task_date == null ? null : DateTime.Parse(request.task_date.ToString()).ToUniversalTime();
      dbTask.start_work_date = request.start_work_date == null ? null : DateTime.Parse(request.start_work_date.ToString()).ToUniversalTime();
      dbTask.appointment_date = request.appointment_date == null ? null : DateTime.Parse(request.appointment_date.ToString()).ToUniversalTime();
      dbTask.create_date = currentDateUtc;
      dbTask.create_by = request.employee_id;
      dbTask.update_date = null;

      this._context.dbtask.Add(dbTask);
      await this._context.SaveChangesAsync();

      foreach (TaskDetail detail in request.TaskDetail)
      {
        detail.task_id = dbTask.task_id.Value;
        detail.create_date = currentDateUtc;
        detail.update_date= null;
        detail.create_by = request.employee_id;
        this._context.task_detail.Add(detail);
        Console.WriteLine(detail.detail_id);
      }
      await this._context.SaveChangesAsync();
      return Ok(dbTask.task_id);
    }
  }
}
