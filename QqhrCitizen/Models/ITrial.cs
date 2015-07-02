using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{

    /// <summary>
    /// 社会I实验
    /// </summary>
    public class ITrial
    {
        /// <summary>
        /// ID
        /// </summary>
        public int ID { get; set; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { set; get; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { set; get; }

        /// <summary>
        /// 链接
        /// </summary>
        public string URL { set; get; }

        /// <summary>
        /// 优先级
        /// </summary>
        public int Priority { set; get; }

        /// <summary>
        ///  图片
        /// </summary>
        public byte[] Picture { get; set; }

        public DateTime Time { set; get; }
    }
}