using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public enum TypeBelonger { 新闻, 文件, 资源链接, 电子书, 课程 }
    public enum Authority { User, Admin }
    public enum Sex { 女, 男 }
    public enum Role { User, Admin }

    public class CommonEnums
    {
        public static string[] Answers = { "A", "B", "C", "D"};
    }
}