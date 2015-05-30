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
        [StringLength(100)]
        public string Title { get; set; }
        public string Description { get; set; }
        [ForeignKey("TypeDictionary")]
        public int EBookTypeID { get; set; }
        public virtual TypeDictionary TypeDictionary { get; set; }
        public DateTime Time { get; set; }
        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }
        [ForeignKey("File")]
        public int FileID { get; set; }
        public virtual File File { get; set; }
    }
}