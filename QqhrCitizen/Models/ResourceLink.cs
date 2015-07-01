using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 资源链接 by JX123
    /// </summary>
    public class ResourceLink
    {
        public int ID { get; set; }

        [StringLength(100)]
        [Index]
        public string Title { get; set; }

        public string URL { get; set; }

        [Index]
        public DateTime Time { get; set; }

        [ForeignKey("TypeDictionary")]
        public int LinkTypeID { get; set; }
        public virtual TypeDictionary TypeDictionary { get; set; }

        public bool IsHaveFile { get; set; }

        public int FileID { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }
    }
}