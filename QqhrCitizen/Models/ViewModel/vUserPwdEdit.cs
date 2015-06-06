using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vUserPwdEdit
    {
        [Required]
        public int ID { get; set; }

        [Display(Name = "用户名")]
        public string Username { get; set; }
        [Display(Name = "原始密码")]
        public string Password { get; set; }

        [Display(Name = "新密码")]
        public string PasswordNew { set; get; }
        public vUserPwdEdit() { }
        public vUserPwdEdit(User user)
        {
            this.ID = user.ID;
            this.Username = user.Username;
        }
        

    }
}