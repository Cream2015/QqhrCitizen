using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Helper
{
    public static class Time
    {
        public static string ToTimeTip(DateTime time)
        {
            var span = DateTime.Now - time;
            if (Math.Abs(span.TotalDays) > 365)
            {
                if (span.TotalDays > 0)
                    return "很久以前";
                else
                    return "很久以后";
            }
            var sec = (long)span.TotalSeconds;
            if (sec == 0)
            {
                return "刚刚";
            }
            else if (Math.Abs(sec) < 60)
            {
                if (sec > 0)
                    return sec + "秒前";
                else
                    return -sec + "秒后";
            }
            else if (Math.Abs(sec) < 60 * 60)
            {
                if (sec > 0)
                    return sec / 60 + "分钟前";
                else
                    return -sec / 60 + "分钟后";
            }
            else if (Math.Abs(sec) < 60 * 60 * 24)
            {
                if (sec > 0)
                    return sec / 60 / 60 + "小时前";
                else
                    return -sec / 60 / 60 + "小时后";
            }
            else if (Math.Abs(sec) < 60 * 60 * 24 * 1)
            {
                if (sec > 0)
                    return sec / 60 / 60 / 24 + "天前";
                else
                    return -sec / 60 / 60 / 24 + "天后";
            }
            return time.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }
}