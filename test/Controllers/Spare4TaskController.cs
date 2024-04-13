using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using test.Models;

namespace test.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskDetailController : ControllerBase
    {
        private readonly DataContext _context;

        public TaskDetailController(DataContext context)
        {
            this._context = context;
        }
        //[HttpGet]
        //public async Task<ActionResult> GetList()
        //{
        //    List<TaskDetail> TaskDetail = this._context.task_detail.ToList();
        //    return Ok(TaskDetail);
        //}
        //[HttpPost]
        //public async Task<ActionResult> AddTaskDetail(TaskDetail TaskDetail)
        //{
        //    this._context.task_detail.Add(TaskDetail);
        //    await this._context.SaveChangesAsync();
        //    return Ok(TaskDetail);
        //}
        //[HttpPut]
        //public async Task<ActionResult> EditTaskDetail(TaskDetail TaskDetail)
        //{
        //    this._context.task_detail.Attach(TaskDetail);
        //    this._context.Entry(TaskDetail).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
        //    await this._context.SaveChangesAsync();
        //    return Ok(TaskDetail);
        //}
        //[HttpDelete]
        //public async Task<ActionResult> DeleteTaskDetail(int detailId)
        //{
        //    TaskDetail TaskDetail = this._context.task_detail.Where(w => w.detail_id == detailId).FirstOrDefault();
        //    this._context.task_detail.Remove(TaskDetail);
        //    await this._context.SaveChangesAsync();
        //    return Ok(TaskDetail);
        //}
    }
}


