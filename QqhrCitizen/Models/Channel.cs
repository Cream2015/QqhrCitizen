using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 直播视频资源 by JX123
    /// </summary>
    public class Channel
    {
        public int ID { get; set; }
        [StringLength(100)]
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Time { get; set; }
        
        [ForeignKey("User")]
        public int UserID { get; set; }
        public virtual User User { get; set; }
        public int AuthorityAsInt { set; get; }

        [NotMapped]
        public Authority Authority
        {
            set { AuthorityAsInt = (int)value; }
            get { return (Authority)AuthorityAsInt; }
        }
    }
    
}