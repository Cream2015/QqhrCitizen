using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class User
    {
        [Required]
        public int ID { get; set; }

        [StringLength(20)]
        [Index]
        public string Username { get; set; }

        [StringLength(40)]
        public string Password { get; set; }

        public byte[] Picture { set; get; }

        public int Age { get; set; }

        [StringLength(40)]
        public string Email { get; set; }
        [StringLength(14)]
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime? Birthday { get; set; }
        [StringLength(20)]
        public string Realname { get; set; }
        public int SexAsInt { set; get; }
        public int RoleAsInt { set; get; }

        public int Score { set; get; }

        [NotMapped]
        public Sex Sex
        {
            set { SexAsInt = (int)value; }
            get { return (Sex)SexAsInt; }
        }

        [NotMapped]
        public Role Role
        {
            set { RoleAsInt = (int)value; }
            get { return (Role)RoleAsInt; }
        }
    }

}