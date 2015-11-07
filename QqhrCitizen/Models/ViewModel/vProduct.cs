using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vProduct
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

        public string ProductCategory { get; set; }

        public string Belong { set; get; }

        public int? TUserID { set; get; }

        public string TUsername { set; get; }

        public vProduct() { }

        public vProduct(Product model)
        {
            DB db = new DB();
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.Price = model.Price;
            this.UserID = model.UserID;
            this.Username = model.User.Username;
            this.Time = model.Time;
            this.ProductImages = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 0 && pf.ProductID == model.ID && pf.IsUse==true).ToList();
            this.ProductVideo = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 1 && pf.ProductID == model.ID && pf.IsUse==true).FirstOrDefault();
            this.ProductCategory = model.ProductCategory.Content;
            this.TUserID = model.TUserID;
            this.TUsername = model.TUsername;
            this.Belong = model.Belong.ToString();
        }
    }
}