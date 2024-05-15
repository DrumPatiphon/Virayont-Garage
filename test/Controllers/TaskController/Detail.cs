using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
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
      public TaskDto DbTask { get; set; }
      public IEnumerable<TaskDetailDTOs> TaskDetail { get; set; }
    }

    public class TaskDto : Dbtask
    {
      public string customer_company { get; set; }
    }

    public class TaskDetailDTOs : TaskDetail
    {
      public decimal? spare_qty_bal { get; set; }
      public decimal? previous_detail_qty { get; set; }
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

    private async Task<TaskDto> GetTaskById(int TaskId)
    {

      var dbTask = await (from dt in _context.Set<Dbtask>()
                          join c in _context.Set<Customer>() on dt.customer_id equals c.customer_id into cg
                          from lc in cg.DefaultIfEmpty()
                          where dt.task_id == TaskId
                          select new TaskDto
                          {
                            task_id = dt.task_id,
                            task_no = dt.task_no,
                            task_date = dt.task_date,
                            task_amt = dt.task_amt,
                            customer_id = lc.customer_id,
                            customer_name = dt.customer_name,
                            customer_lastname = dt.customer_lastname,
                            customer_phone = dt.customer_phone,
                            customer_company = lc.company_name,
                            customer_address = dt.customer_address,
                            employee_id = dt.employee_id,
                            license_desc = dt.license_desc,
                            remark = dt.remark,
                            status = dt.status,
                            province_id = dt.province_id,
                            start_work_date = dt.start_work_date,
                            appointment_date = dt.appointment_date,
                            create_date = dt.create_date,
                            update_date = dt.update_date,
                            create_by = dt.create_by,
                          }).SingleOrDefaultAsync();
      return dbTask;
    }

    private async Task<IEnumerable<TaskDetailDTOs>> GetTaskDetailById(int TaskId)
    {
      //var taskDetails = await _context.Set<TaskDetail>()
      //    .Where(o => o.task_id == TaskId)
      //    .OrderBy(o => o.seq)
      //    .ToListAsync();

      var taskDetails = await (from td in _context.Set<TaskDetail>()
                               join s in _context.Set<SparePart>() on td.spare_id equals s.spare_id
                               where td.task_id == TaskId
                               select new TaskDetailDTOs
                               {
                                 detail_id = td.detail_id,
                                 task_id = td.task_id,
                                 seq = td.seq,
                                 spare_id = td.spare_id,
                                 spare_desc = td.spare_desc,
                                 detail_description = td.detail_description,
                                 detail_qty = td.detail_qty,
                                 detail_unit_price = td.detail_unit_price,
                                 detail_amt = td.detail_amt,
                                 create_by = td.create_by,
                                 create_date = td.create_date,
                                 update_date = td.update_date,
                                 spare_bal = td.spare_bal,
                                 spare_qty_bal = s.spare_bal,
                                 previous_detail_qty = td.detail_qty,
                               }).ToListAsync();

      return taskDetails;
    }


  }
}
