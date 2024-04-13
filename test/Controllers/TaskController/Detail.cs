using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using test.Models;

namespace test.Controllers.TaskController
{
  [Route("api/task/[controller]")]
  [ApiController]
  public class Detail : Controller
  {
    private readonly DataContext _context;
    public Detail(DataContext context)
    {
      _context = context;
    }

    public class Request
    {
      public int task_id { get; set; }
    }

    public class DbTaskDto
    {
      public Dbtask DbTask { get; set; }
      public IEnumerable<TaskDetail> TaskDetail { get; set; }
    }

    [HttpGet("{taskId}")]
    public async Task<ActionResult<DbTaskDto>> GetDbTaskById(int taskId)
    {

      var dbTask = await GetTaskById(taskId);

      if (dbTask == null)
      {
        return NotFound();
      }

      var taskDetail = await GetTaskDetailById(taskId);

      var dbTaskDto = new DbTaskDto
      {
        DbTask = dbTask,
        TaskDetail = taskDetail
      };

      return dbTaskDto;
    }

    private async Task<Dbtask> GetTaskById(int TaskId)
    {
      var dbTask = await _context.Set<Dbtask>()
          .Where(o => o.task_id == TaskId)
          .SingleOrDefaultAsync();

      return dbTask;
    }

    private async Task<IEnumerable<TaskDetail>> GetTaskDetailById(int TaskId)
    {
      var taskDetails = await _context.Set<TaskDetail>()
          .Where(o => o.task_id == TaskId)
          .ToListAsync();

      return taskDetails;
    }


  }
}
