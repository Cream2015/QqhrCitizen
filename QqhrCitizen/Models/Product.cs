using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class Product
    {
        /// <summary>
        /// ID
        /// </summary>
        public int ID { set; get; }

        /// <summary>
        /// 标题
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// 描述
        /// </summary>
        public string Description { set; get; }

        /// <summary>
        /// 价格
        /// </summary>
        public string Price { set; get; }

        /// <summary>
        ///  增加者的ID
        /// </summary>
        [ForeignKey("User")]
        public int UserID { set; get; }

        public virtual User User { set; get; }

        /// <summary>
        /// 发布日期
        /// </summary>
        public DateTime Time { set; get; }

        /// <summary>
        /// 分类
        /// </summary>
        public ProductCategory ProductCategory { set; get; }

        /// <summary>
        /// 当为 作品 对应User 可为空
        /// </summary>
        public int? TUserID { set; get; }
    }

    public enum ProductCategory { 商品, 作品 }
}