using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models.ViewModel
{
    public class vUserProductInfo
    {
        public int ID { set; get; }

        public string Title { set; get; }

        public string Description { set; get; }

        public int UserID { set; get; }

        public string Username { set; get; }

        public string Price { set; get; }

        public DateTime Time { set; get; }

        public List<ProductFile> ProductImages { set; get; }

        public ProductFile ProductVideo { set; get; }

        public string ProductTitle { set; get; }

        public string Status { set; get; }

        public vUserProductInfo() { }

        public vUserProductInfo(ProductUserInfo model)
        {
            DB db = new DB();
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.UserID = model.AuthorID;
            this.Username = model.User.Username;
            this.Status = model.Status.ToString();
            this.Time = model.Time;
            this.Price = model.Price.ToString();
            this.ProductTitle = model.Product.Title;
            this.ProductImages = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 0 && pf.PUId == model.ID).ToList();
            this.ProductVideo = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 1 && pf.PUId == model.ID).FirstOrDefault();
        }
    }
}
