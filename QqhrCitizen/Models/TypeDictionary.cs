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
        [StringLength(20)]
        public string TypeKey { get; set; }
        [StringLength(50)]
        public string TypeValue { get; set; }
        public DateTime Time { get; set; }
        //[ForeignKey("User")]
        //public int UserID { get; set; }
        //public virtual User User { get; set; }
        public bool NeedAuthorize { get; set; }

        /// <summary>
        ///  输入哪一类
        /// </summary>
        public BelongerType Belonger { get; set; }

        public int? FatherID { get; set; }
    }


}