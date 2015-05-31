using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vLogin
    {
        [Required]
        [Display(Name = "用户名")]
        public string Username { get; set; }

        [Required]
        [Display(Name = "密码")]
        public string Password { get; set; }

        [Display(Name = "记住我")]
        public bool RememberMe { get; set; }
    }
}