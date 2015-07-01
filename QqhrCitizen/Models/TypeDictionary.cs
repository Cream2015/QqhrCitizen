using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 类型字典 by JX123
    /// </summary>
    public class TypeDictionary
    {
        public int ID { get; set; }

        [StringLength(50)]
        [Index]
        public string TypeValue { get; set; }

        public DateTime Time { get; set; }

        //[ForeignKey("User")]
        //public int UserID { get; set; }
        //public virtual User User { get; set; }

        /// <summary>
        /// 是否登陆标记
        /// </summary>
        public bool NeedAuthorize { get; set; }

        /// <summary>
        ///  输入哪一类
        /// </summary>
        public TypeBelonger Belonger { get; set; }
        
        public int? FatherID { get; set; }
        
        [NotMapped]
        public List<TypeDictionary> Children
        {
            get
            {
                var ret = new List<TypeDictionary>();
                if (FatherID != 0) return ret;
                using (DB db = new DB())
                {
                    ret = (from td in db.TypeDictionaries
                           where td.FatherID == ID
                           select td).ToList();
                    return ret;
                }
            }
        }
    }
}