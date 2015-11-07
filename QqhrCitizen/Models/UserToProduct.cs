using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models
{
    public class UserToProduct
    {
        public int ID { get; set; }

        public int UserID { set; get; }

        public int ProductCategoryID { set; get; }

        public virtual User User { set; get; }

        public virtual ProductCategory ProductCategory { set; get; }
    }
}
