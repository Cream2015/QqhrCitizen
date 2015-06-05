using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Filters
{
    public class BaseAuthAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            DB db = new DB();
            User user = db.Users.Where(u => u.Username == HttpContext.Current.User.Identity.Name).FirstOrDefault();
            if (user != null)
            {
                if (Roles.Contains(user.Role.ToString()))
                {
                    return true;
                }
                else
                {
                    return base.AuthorizeCore(httpContext);
                }
            }
            else 
            {
                return base.AuthorizeCore(httpContext);
            }
        }
    }
}