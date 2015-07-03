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

    }
}