using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace todo.Models
{
    public class TaskModel
    {
        public Guid TaskId { get; set; }
        public bool IsActive { get; set; }       
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime BeginTime { get; set; }
        public DateTime CompletionTime { get; set; }
    }
}