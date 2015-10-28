using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QqhrCitizen.Models.ViewModel
{
    public class vProductListModel
    {
        public int ID { set; get; }

        public string Title { set; get; }

        public string Description { set; get; }

        public int UserID { set; get; }

        public string Username { set; get; }

        public string Price { set; get; }

        public DateTime Time { set; get; }

        public string FirstImagePath { set; get; }

        public string ProductCategory { get; set; }

        public int? TUserID { set; get; }

        public string TUsername { set; get; }

        public vProductListModel() { }

        public vProductListModel(Product model)
        {
            this.ID = model.ID;
            this.Title = model.Title;
            this.Description = model.Description;
            this.Price = model.Price;
            this.UserID = model.UserID;
            this.Username = model.User.Username;
            this.Time = model.Time;
            using (DB db = new DB())
            {
                ProductFile file = db.ProductFiles.Where(pf => pf.FileTypeAsInt == 0 && pf.ProductID == model.ID).FirstOrDefault();
                if (file != null)
                {
                    this.FirstImagePath = file.Path;
                }
            }

            this.ProductCategory = model.ProductCategory.ToString();
            this.TUserID = model.TUserID;
            this.TUsername = model.TUsername;
        }
    }
}
