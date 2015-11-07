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
        public ActionResult Index(int Category = 0, int Belong = 2)
        {
            //Flag 1.产品第一层 2.产品第二层 3.产品第三层  4.作品第一层 5.作品第二层 6.全部
            ViewBag.Flag = 1;
            ViewBag.Category = Category;
            ViewBag.Belong = Belong;
            if (Belong == 2)
            {
                ViewBag.Flag = 6;
            }
            if (Category == 0 && Belong == 0)
            {
                ViewBag.Flag = 1;
            }
            else if (Category == 0 && Belong == 1)
            {
                ViewBag.Flag = 4;
            }
            else
            {
                ProductCategory category = db.ProductCategories.Find(Category);
                if (Belong == 0 && category.Father == null)
                {
                    ViewBag.Flag = 2;
                }
                if (Belong == 0 && category.Father != null)
                {
                    ViewBag.Flag = 3;
                }
                if (Belong == 1 && category.Father == null)
                {
                    ViewBag.Flag = 5;
                    ViewBag.Author = category;
                }
            }
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
        public ActionResult getProductByPage(int page, int flag, int belong)
        {
            int index = page * 12;
            if (flag == 1)
            {
                List<ProductCategory> categories = new List<ProductCategory>();
                List<ProductListItem> listItem = new List<ProductListItem>();
                categories = db.ProductCategories.Where(pc => (pc.FatherID == null || pc.FatherID == 0) && pc.Belong == ProductBelong.产品).OrderByDescending(pc => pc.AddTime).Skip(index).Take(12).ToList();
                foreach (var item in categories)
                {
                    listItem.Add(new ProductListItem(item, belong));
                }
                return Json(listItem, JsonRequestBehavior.AllowGet);
            }
            if (flag == 2)
            {
                List<ProductCategory> categories = new List<ProductCategory>();
                List<ProductListItem> listItem = new List<ProductListItem>();
                categories = db.ProductCategories.Where(pc => (pc.FatherID != null && pc.FatherID != 0) && pc.Belong == ProductBelong.产品).OrderByDescending(pc => pc.AddTime).Skip(index).Take(12).ToList();
                foreach (var item in categories)
                {
                    listItem.Add(new ProductListItem(item, belong));
                }
                return Json(listItem, JsonRequestBehavior.AllowGet);
            }
            if (flag == 3)
            {
                List<Product> products = new List<Product>();
                List<ProductListItem> _products = new List<ProductListItem>();
                products = db.Products.Where(p => p.Belong == ProductBelong.产品).OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
                foreach (var item in products)
                {
                    _products.Add(new ProductListItem(item));
                }
                return Json(_products, JsonRequestBehavior.AllowGet);
            }
            if (flag == 4)
            {
                List<ProductCategory> categories = new List<ProductCategory>();
                List<ProductListItem> listItem = new List<ProductListItem>();
                categories = db.ProductCategories.Where(pc => (pc.FatherID == null || pc.FatherID == 0) && pc.Belong == ProductBelong.作品).OrderByDescending(pc => pc.AddTime).Skip(index).Take(12).ToList();
                foreach (var item in categories)
                {
                    listItem.Add(new ProductListItem(item, belong));
                }
                return Json(listItem, JsonRequestBehavior.AllowGet);
            }
            else if (flag == 5)
            {
                List<Product> products = new List<Product>();
                List<ProductListItem> _products = new List<ProductListItem>();
                products = db.Products.Where(p => p.Belong == ProductBelong.作品).OrderByDescending(p => p.Time).Skip(index).Take(12).ToList();
                foreach (var item in products)
                {
                    _products.Add(new ProductListItem(item));
                }
                return Json(_products, JsonRequestBehavior.AllowGet);
            }
            else if (flag == 6)
            {
                List<ProductCategory> categories = new List<ProductCategory>();
                List<ProductListItem> listItem = new List<ProductListItem>();
                categories = db.ProductCategories.Where(pc => (pc.FatherID == null || pc.FatherID == 0)).OrderByDescending(pc => pc.AddTime).Skip(index).Take(12).ToList();
                foreach (var item in categories)
                {
                    listItem.Add(new ProductListItem(item, belong));
                }
                return Json(listItem, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(null);
            }

        }
        #endregion


        public FileResult ProductCategoryImgage(int id)
        {
            ProductCategory category = new ProductCategory();
            category = db.ProductCategories.Find(id);
            return File(category.Picture, "image/jpg");
        }
    }
}