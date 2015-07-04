using QqhrCitizen.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Filters
{
    public class AccessToLiveAttribute: AuthorizeAttribute
    {
        public static string msg = "";
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            using (var db = new DB())
            {
                var id = 0;
                if (((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"] != null)
                    id = Convert.ToInt32(((MvcHandler)httpContext.Handler).RequestContext.RouteData.Values["id"]);
                else
                    id = Convert.ToInt32(httpContext.Request.Form["id"]);
                var live = db.Lives.Find(id);
                if (live.NeedAuthorize)
                {
                    if (!httpContext.User.Identity.IsAuthenticated)
                    {
                        msg = "请先登陆在观看内容";
                        return false;
                    }
                }
            }
            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            filterContext.Result = new RedirectResult("/Shared/Info?msg=" + msg);
        }
    }
}