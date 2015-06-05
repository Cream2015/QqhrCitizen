using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vUserPwEdit
    {
        [Required]
        public int ID { get; set; }

        [Display(Name = "用户名")]
        public string Username { get; set; }
        [Display(Name = "原始密码")]
        public string Password { get; set; }

        [Display(Name = "新密码")]
        public string PasswordNew { set; get; }

    }
}