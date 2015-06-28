using QqhrCitizen.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace System.Web.Mvc
{
    public static class MvcHtmlHelperExt
    {
        public static MvcHtmlString Sanitized<TModel>(this HtmlHelper<TModel> self, string html)
        {
            if (html == null) return new MvcHtmlString("");
            return new MvcHtmlString(HtmlFilter.Instance.SanitizeHtml(html));
        }

        public static MvcHtmlString AntiForgerySID<TModel>(this HtmlHelper<TModel> self)
        {
            return new MvcHtmlString("<input type=\"hidden\" name=\"sid\" value=\"" + self.ViewBag.SID + "\" />");
        }

        public static MvcHtmlString MakePager<TModel>(this HtmlHelper<TModel> self)
        {
            var tmp = (PagerInfo)self.ViewBag.PageInfo;
            var p = self.ViewContext.HttpContext.Request.QueryString["p"] == null ? 1 : Convert.ToInt32(self.ViewContext.HttpContext.Request.QueryString["p"]);
            var html = "<div class=\"pager\">";
            for (var i = tmp.Start; i <= tmp.End; i++)
            {
                var str = "?p=" + i;
                foreach (string k in self.ViewContext.HttpContext.Request.QueryString.Keys)
                {
                    if (k == "p") continue;
                    str += "&" + HttpUtility.UrlEncode(k) + "=" + HttpUtility.UrlEncode(self.ViewContext.HttpContext.Request.QueryString[k]);
                }
                if (p == i)
                    html += "<a class=\"pager-item active\" href=\"" + str + "\">" + i + "</a>";
                else
                    html += "<a class=\"pager-item\" href=\"" + str + "\">" + i + "</a>";
            }
            html += "</div>";
            return new MvcHtmlString(html);
        }
    }
}