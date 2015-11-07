using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models
{
    public class ProductCategory
    {
        public int ID { set; get; }

        public string Content { set; get; }

        //属于那个大类 0产品 1作品
        public ProductBelong Belong { set; get; }

        /// <summary>
        /// 优先级  越小越靠前 不填写最靠前
        /// </summary>
        public int? Priority { set; get; }

        public int? FatherID { set; get; }

        public DateTime? AddTime { set; get; }

        public byte[] Picture { set; get; }

        public string Description { set; get; }

        [NotMapped]
        public ProductCategory Father
        {
            get
            {
                if (FatherID != null)
                {
                    using (DB db = new DB())
                    {
                        return db.ProductCategories.Find(FatherID);
                    }
                }
                else
                {
                    return null;
                }
            }
        }
    }

    public enum ProductBelong { 产品, 作品 }
}
