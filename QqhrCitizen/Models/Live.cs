using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations.Schema;

namespace QqhrCitizen.Models
{
    public class Live
    {
        public int ID { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public string LiveURL { get; set; }

        public byte[] Picture { get; set; }

        [Index]
        public DateTime Begin { get; set; }

        [Index]
        public DateTime End { get; set; }
    }
}