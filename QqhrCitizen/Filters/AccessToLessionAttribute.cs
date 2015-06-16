using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Filters
{
    public class AccessToLessionAttribute:BaseAuthAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext.User.Identity.IsAuthenticated)
            {
                using (var db = new DB())
                {
                    var user = (from u in db.Users
                                where u.Username == httpContext.User.Identity.Name
                                select u).Single();
                    if (user.RoleAsInt > 0) return true;
                    var id = 0;
                    if (((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"] != null)
                        id = Convert.ToInt32(((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"]);
                    else
                        id = Convert.ToInt32(httpContext.Request.Form["id"]);
                    var lession = db.Lessions.Find(id);
                    if (user.RoleAsInt >= lession.Course.AuthorityAsInt)
                        return true;
                }
            }
            return false;
        }
    }
}