using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Filters
{
    public class AccessToLessionAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            using (var db = new DB())
            {
                var id = 0;
                if (((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"] != null)
                    id = Convert.ToInt32(((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"]);
                else
                    id = Convert.ToInt32(httpContext.Request.Form["id"]);
                var lession = db.Lessions.Find(id);
                if (lession.Course.Authority == Authority.Login)
                {
                    if (!httpContext.User.Identity.IsAuthenticated)
                    {
                        return false;
                    }
                }
            }

            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectResult("/Shared/Info?msg=请登录之后再观看");
        }
    }
}