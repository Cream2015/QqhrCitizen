using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models
{
    /// <summary>
    /// 当Product为User是对应的信息
    /// </summary>
    public class ProductUserInfo
    {
        public int ID { set; get; }

        /// <summary>
        /// 用户
        /// </summary>
        public int AuthorID { set; get; }

        /// <summary>
        /// 产品
        /// </summary>
        public int ProductID { set; get; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { set; get; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { set; get; }

        /// <summary>
        /// 价格
        /// </summary>
        public decimal Price { set; get; }

        /// <summary>
        /// 状态
        /// </summary>
        public ProductUserInfoStatusEnum Status { set; get; }

        [ForeignKey("AuthorID")]
        public virtual User User { get; set; }

        public virtual Product Product { set; get; }

        /// <summary>
        /// 时间
        /// </summary>
        public DateTime Time { set; get; }
    }

    public enum ProductUserInfoStatusEnum { 审核中, 审核通过, 审核不通过 }
}
