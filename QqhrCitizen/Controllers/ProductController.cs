using QqhrCitizen.Models;
using QqhrCitizen.Models.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace QqhrCitizen.Controllers
{
    public class ProductController : BaseController
    {
        // GET: Product
        public ActionResult Index(int? id)
        {
            return View();
        }

        public ActionResult Show(int id)
        {
            Product product = new Product();
            product = db.Products.Find(id);
            vProduct pro = new vProduct(product);
            if (pro.ProductVideo == null)
            {
                ViewBag.ProductVideo = 0;
            }
            else
            {
                ViewBag.ProductVideo = 1;
            }
            ViewBag.Product = pro;
            return View();
        }

        #region 分页查找产品
        /// <summary>
        /// 分页查找产品
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getProductByPage(int page,int? tid)
        {
            if (tid != null && tid != 0)
            {
                List<Product> products = new List<Product>();
                List<vProduct> _products = new List<vProduct>();
                int index = page * 12;
                products = db.Products.Where(p=>p.ProductCategory==(ProductCategory)tid).OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
                foreach (var item in products)
                {
                    _products.Add(new vProduct(item));
                }
                return Content(Newtonsoft.Json.JsonConvert.SerializeObject(_products));
            }
            else
            {
                List<Product> products = new List<Product>();
                List<vProduct> _products = new List<vProduct>();
                int index = page * 12;
                products = db.Products.OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
                foreach (var item in products)
                {
                    _products.Add(new vProduct(item));
                }
                return Content(Newtonsoft.Json.JsonConvert.SerializeObject(_products));
            }
        }
        #endregion

    }
}