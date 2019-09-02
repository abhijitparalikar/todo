using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using todo.Models;


namespace todo.Controllers
{
    public class HomeController : Controller
    {
        public static Dictionary<Guid, TaskModel> tasks = new Dictionary<Guid, TaskModel>();
        //public static List<TaskModel> tasks = new List<TaskModel>();

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult List()
        {
            ViewBag.title = "All Tasks";
            return View(tasks.Values.ToList());
        }

        public ActionResult Active()
        {
            var activeList = tasks.Values.Where(x => x.IsActive).ToList();
            ViewBag.title = "Active Tasks";

            return View("~/Views/Home/List.cshtml", activeList);
        }

        public ActionResult Completed()
        {
            var completedList = tasks.Values.Where(x => !x.IsActive).ToList();
            ViewBag.title = "Completed Tasks";

            return View("~/Views/Home/List.cshtml", completedList);           
        }

        public ActionResult AddTask(string title, string description)
        {
            TaskModel model = new TaskModel();

            if (string.IsNullOrWhiteSpace(title))
            {
                model.TaskId = Guid.Empty;
                return Json(model);
            }

            model.TaskId = Guid.NewGuid();
            model.Title = title;
            model.IsActive = true;
            model.Description = description;
            model.BeginTime = DateTime.Now;

            tasks[model.TaskId] = model;

            //return Json(model);
            return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject(model) };
        }

        public ActionResult EditTask(string Id, string title, string description)
        {
            Guid id = new Guid(Id);

            if (tasks.ContainsKey(id))
            {
                tasks[id].Title = title;
                tasks[id].Description = description;

                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject(tasks[id]) };
            }
            else
            {
                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject("error") };
            }
        }

        public ActionResult TaskCompleted(string taskId)
        {
            Guid id = new Guid(taskId);

            if (tasks.ContainsKey(id))
            {
                tasks[id].IsActive = false;
                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject(tasks[id]) };
            }
            else
            {
                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject("error") };
            }
            
        }


        public ActionResult DeleteTask(string taskId)
        {
            Guid id = new Guid(taskId);

            if (tasks.ContainsKey(id))
            {
                tasks.Remove(id);
                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject("success") };
            }
            else
            {
                return new ContentResult { ContentType = "application/json", Content = Newtonsoft.Json.JsonConvert.SerializeObject("error") };
            }
        }
    }
}