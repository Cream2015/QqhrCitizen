using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Helpers
{
    public static class MvcHtmlHelperExt
    {
        public static MvcHtmlString Sanitized<TModel>(this HtmlHelper<TModel> self, string html)
        {
            if (html == null) return new MvcHtmlString("");
            return new MvcHtmlString(HtmlFilter.Instance.SanitizeHtml(html));
        }
    }
}