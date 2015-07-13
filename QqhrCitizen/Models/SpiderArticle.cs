using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QqhrCitizen.Models
{
    public enum SpiderArticleStatus
    {
        待审核,
        已收录,
        已废弃
    }

    public class SpiderArticle
    {
        public int ID { get; set; }

        [StringLength(256)]
        [Index]
        public string Title { get; set; }

        [Index]
        public DateTime Time { get; set; }

        public string Content { get; set; }

        [StringLength(512)]
        [Index]
        public string URL { get; set; }

        [Index]
        public SpiderArticleStatus Status { get; set; }

        [StringLength(256)]
        [Index]
        public string Source { get; set; }

        [ForeignKey("News")]
        public int? NewsID { get; set; }

        public virtual News News { get; set; }
    }
}