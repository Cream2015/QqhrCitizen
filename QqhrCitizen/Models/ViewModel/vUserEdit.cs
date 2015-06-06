using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vUserEdit
    {
        [Required]
        public int ID { get; set; }
        public string Username { get; set; }
        public byte[] Picture { set; get; }
        public int Age { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime Birthday { get; set; }
        public string Realname { get; set; }
        public Sex Sex { get; set; }
        public vUserEdit() { }
        public vUserEdit(User user) {
            this.ID = user.ID;
            this.Username = user.Username;
        }
    }
}