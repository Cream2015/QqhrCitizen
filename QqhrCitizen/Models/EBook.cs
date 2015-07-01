using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 电子书资源 by JX123
    /// </summary>
    public class EBook
    {
        public int ID { get; set; }

        [StringLength(256)]
        [Index]
        public string Title { get; set; }

        public string Description { get; set; }

        [ForeignKey("TypeDictionary")]
        public int EBookTypeID { get; set; }
       
        public virtual TypeDictionary TypeDictionary { get; set; }

        public string Author { get; set; }

        [Index]
        public DateTime Time { get; set; }

        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }

        public byte[] Picture { get; set; }

        [ForeignKey("File")]
        public int FileID { get; set; }

        public virtual File File { get; set; }

        /// <summary>
        /// 浏览数
        /// </summary>
        public int Browses { get; set; }
    }
}