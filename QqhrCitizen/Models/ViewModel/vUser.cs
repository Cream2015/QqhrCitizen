using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vUser
    {
        public int ID { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public int Age { get; set; }

        public string Email { get; set; }

        public string Phone { get; set; }

        public string Address { get; set; }

        public DateTime? Birthday { get; set; }

        public string Realname { get; set; }

        public Sex Sex { get; set; }
        public Role Role { get; set; }
        public byte[] Picture { set; get; }
        public vUser() { }

        public vUser(User user)
        {
            this.ID = user.ID;
            this.Username = user.Username;
            this.Password = user.Password;
            this.Age = user.Age;
            this.Email = user.Email;
            this.Phone = user.Phone;
            this.Address = user.Address;
            this.Birthday = user.Birthday;
            this.Role = user.Role;
            this.Realname = user.Realname;
            this.Sex = user.Sex;
            this.Picture = user.Picture;
        }
    }
}
