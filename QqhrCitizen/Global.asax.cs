using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace QqhrCitizen
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            RouteConfig.RegisterRoutes(RouteTable.Routes);
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
