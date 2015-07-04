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
                var lession = db.Lessions.Find(id);
                var course = db.Courses.Find(lession.CourseID);

                if (lession.Course.TypeDictionary.NeedAuthorize == true)
                {
                    if (!httpContext.User.Identity.IsAuthenticated)
                    {
                        msg = "请先登陆在学习该节内容";
                        return false;
                    }
              
                    List<Lession> lessions = db.Lessions.Where(l => l.Course.ID == lession.CourseID).OrderBy(l => l.Time).ToList();
                   
                    for (int i = 0; i < lessions.Count; i++)
                    {
                        if (lession.ID == lessions[i].ID)
                        {

                            if (i == 0)
                            {
                                break;
                            }
                            int tempId = lessions[i - 1].ID;
                            
                            LessionScore lesssionScore = db.LessionScores.Where(ls => ls.LessionId == tempId).OrderByDescending(ls=>ls.Time).FirstOrDefault();

                            if (lesssionScore == null)
                            {
                                msg = "请先完成上一节的测试，在学习该节";
                                return false;
                            }
                            else
                            {
                                if (!lesssionScore.IsPassTest)
                                {
                                    msg = "请先完成上一节的测试，在学习该节";
                                    return false;
                                }
                            }
                           
                        }
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