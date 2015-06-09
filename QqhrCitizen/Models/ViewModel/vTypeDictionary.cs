using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models.ViewModel
{
    public class vTypeDictionary
    {

        public int ID { get; set; }

        public string TypeValue { get; set; }

        public string Time { get; set; }

        /// <summary>
        /// 是否登陆标记
        /// </summary>
        public bool NeedAuthorize { get; set; }

        /// <summary>
        ///  输入哪一类
        /// </summary>
        public TypeBelonger Belonger { get; set; }

        public int? FatherID { get; set; }

        public List<TypeDictionary> Children { set; get; }

        public vTypeDictionary() { }

        public vTypeDictionary(TypeDictionary model)
        {
            DB db =new DB();
            this.ID = model.ID;
            this.TypeValue = model.TypeValue;
            this.Time = model.Time.ToString();
            this.NeedAuthorize = model.NeedAuthorize;
            this.Belonger = model.Belonger;
            this.FatherID = model.FatherID;
            this.Children = db.TypeDictionaries.Where(td => td.FatherID == model.ID).ToList();
        }
    }
}