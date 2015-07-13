using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Timers;
using QqhrCitizen.Spider;

namespace QqhrCitizen
{
    public class MvcApplication : System.Web.HttpApplication
    {
        public static List<Spider.Spider>  Spiders = new List<Spider.Spider>();

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            /* 添加爬虫 */
            Spiders.Add(new ApclcSpider());
            Spiders.Add(new MoeSpider());
            Spiders.Add(new HljceduSpider());
            Spiders.Add(new PeopleSpider());

            var SpiderTimer = new Timer();
            SpiderTimer.Interval = 1000 * 60 * 60 * 4;
            SpiderTimer.Elapsed += SpiderTimer_Elapsed;
            SpiderTimer.Start();

            foreach (var s in Spiders)
                s.SpiderBegin();
        }

        private void SpiderTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            foreach (var s in Spiders)
                s.SpiderBegin();
        }

        protected void Session_Start(object sender, EventArgs e)
        {
            Session["sid"] = Helpers.String.RandomString(64);
        }
       /* protected void Application_Error(object sender, EventArgs e)
         {
             var ex = Server.GetLastError() as HttpException;
             if (ex == null)
                 return;
 
             var httpStatusCode = ex.GetHttpCode();
 
             if (httpStatusCode == 404)
             {
                 var httpContext = (sender as MvcApplication).Context;
 
                 httpContext.ClearError();
                 httpContext.Response.Clear();
                 httpContext.Response.StatusCode = 404;
                 ServiceFocus.LogService.AddLog(ex);
 
                 httpContext.Response.ContentType = "text/html; charset=utf-8";
                 var routeData = new RouteData();
                 routeData.Values["controller"] = "Sys";
                 routeData.Values["action"] = "NotFound";
                 var requestContext = new RequestContext(new HttpContextWrapper(httpContext), routeData);
                 var controller = ControllerBuilder.Current.GetControllerFactory().CreateController(requestContext, "Sys") as SysController;
                 //controller.ViewData.Model=model;
                 (controller as IController).Execute(requestContext);
                 ControllerBuilder.Current.GetControllerFactory().ReleaseController(controller);
             }
        }*/
    }
}
