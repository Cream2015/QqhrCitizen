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
      
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            DB db = new DB();
            User user = db.Users.Where(u => u.Username == HttpContext.Current.User.Identity.Name).FirstOrDefault();
            if (user != null)
            {
                if (Roles.Contains(user.Role.ToString()))
                {
                    base.OnAuthorization(filterContext);
                }
                else
                {
                    if (Roles.Contains("Admin"))
                    {
                        filterContext.RequestContext.HttpContext.Response.Redirect("/Shared/Info?msg=" + "你没有权限查看此页面！");
                    }
                    else if (Roles.Contains("User"))
                    {
                        filterContext.RequestContext.HttpContext.Response.Redirect("/Shared/Info?msg="+"你没有权限查看此页面！");
                    }
                }
            }
            else
            {
                if (Roles.Contains("Admin"))
                {
                    filterContext.RequestContext.HttpContext.Response.Redirect("/Admin/Login");
                }
                else if (Roles.Contains("User"))
                {
                    filterContext.RequestContext.HttpContext.Response.Redirect("/User/Login");
                }
            }
        }
    }
}