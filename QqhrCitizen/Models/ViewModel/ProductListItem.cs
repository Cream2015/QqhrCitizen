using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models.ViewModel
{
    public class ProductListItem
    {
        public int ID { set; get; }

        public string Title { set; get; }

        public string Url { set; get; }

        public string FacePath { set; get; }

        public ProductListItem(ProductCategory model,int Belong)
        {
            this.ID = model.ID;
            this.Title = model.Content;
            this.Url = "/Product/Index?Category="+model.ID+"&Belong="+(int)model.Belong;
            this.FacePath = "/Product/ProductCategoryImgage/" + model.ID;
        }

        public ProductListItem(Product model)
        {
            ProductFile file = new ProductFile();
            this.ID = model.ID;
            this.Title = model.Title;
            this.Url = "/Product/Show/" + model.ID;
            this.FacePath = "/Product/";
            using (DB db = new DB())
            {
                file = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 0 && pf.ProductID == model.ID && pf.IsUse == true).FirstOrDefault();
                if (file == null)
                {
                    this.FacePath = "/Images/productpre.jpg";
                }
                else
                {
                    this.FacePath = file.Path;
                }
            }
        }
    }
}
