using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vRegister
    {
        [Display(Name = "用户名")]
        public string Username { get; set; }

        [Display(Name = "密码")]
        public string Password { get; set; }

        [Display(Name = "真实姓名")]
        public string Realname { get; set; }

        [Display(Name = "电子邮箱")]
        public string Email { get; set; }

        [Display(Name = "电话号码")]
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}