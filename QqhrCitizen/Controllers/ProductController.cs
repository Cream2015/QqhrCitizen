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
        public ActionResult Index()
        {
            List<Product> products = new List<Product>();
            List<vProduct> _products = new List<vProduct>();
            products = db.Products.ToList();
            foreach (var item in products)
            {
                _products.Add(new vProduct(item));
            }
            ViewBag.Products = _products;
            return View();
        }

        public ActionResult Show(int id)
        {
            Product product = new Product();
            product = db.Products.Find(id);
            ViewBag.Product = new vProduct(product);
            return View();
        }

        #region 分页查找产品
        /// <summary>
        /// 分页查找产品
        /// </summary>
        /// <param name="page"></param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getProductByPage(int page)
        {
            List<Product> products = new List<Product>();
            int index = page * 12;
            products = db.Products.OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
            return Json(products, JsonRequestBehavior.AllowGet);
        } 
        #endregion

    }
}