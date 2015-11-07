using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    /// <summary>
    ///  产品图片
    /// </summary>
    public class ProductFile
    {
        /// <summary>
        /// ID
        /// </summary>
        public int ID { set; get; }

        /// <summary>
        ///  产品ID
        /// </summary>
        public int? ProductID { set; get; }

        /// <summary>
        /// 文件路径
        /// </summary>
        public string Path { set; get; }

        /// <summary>
        /// 文件类型
        /// </summary>
        public int FileTypeAsInt { set; get; }

        [NotMapped]
        public ProductFileType ProductFileType
        {
            set { FileTypeAsInt = (int)value; }
            get { return (ProductFileType)FileTypeAsInt; }
        }

        /// <summary>
        /// 文件来源
        /// </summary>
        public SourceEnum Source { set; get; }

        /// <summary>
        /// 是否启用
        /// </summary>
        public bool IsUse { set; get; }

        /// <summary>
        ///  ProductUserInfo ID
        /// </summary>
        public int? PUId { set; get; }
    }

    public enum ProductFileType { image, video }

    public enum SourceEnum { 用户, 管理员 }


}