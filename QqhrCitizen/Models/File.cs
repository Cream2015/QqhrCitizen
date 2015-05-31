using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 文件资源 by JX123
    /// </summary>
    public class File
    {
        public int ID { get; set; }
        [StringLength(50)]
        public string FileName { get; set; }
        public string Path { get; set; }
        public DateTime Time { get; set; }
        [ForeignKey("TypeDictionary")]
        public int FileTypeID { get; set; }
        public virtual TypeDictionary TypeDictionary { get; set; }
        [StringLength(50)]
        public string ContentType { get; set; }
        [StringLength(10)]
        public string FileSize { get; set; }
    }
}