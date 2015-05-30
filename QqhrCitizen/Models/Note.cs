using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 用户课程笔记 by JX123
    /// </summary>
    public class Note
    {

        [Column("ID")]
        public int ID { get; set; }
        [Column("LessionID")]
        [ForeignKey("Lession")]
        public int LessionID { get; set; }
        public virtual Lession Lession { get; set; }
        [Column("UserID")]
        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }
        [Column("Time")]
        public DateTime Time { get; set; }
        [Column("Content")]
        public string Content { get; set; }
    }
}