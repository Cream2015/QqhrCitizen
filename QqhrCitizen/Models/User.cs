using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class User
    {
        public int ID { get; set; }
        [StringLength(20)]
        public string Username { get; set; }
        [StringLength(40)]
        public string Password { get; set; }
        public int Age { get; set; }
        [StringLength(40)]
        public string Email { get; set; }
        [StringLength(14)]
        public string Phone { get; set; }
        public enum Sex {Male,Female}
        public string Address { get; set; }
        public enum Role { Admin,User }
        public DateTime Birthday { get; set; }
        [StringLength(20)]
        public string Realname { get; set; }


    }
}