using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace QqhrCitizen.Models
{
    public class Joke
    {
        public int ID { get; set; }

        public string Content { get; set; }

        public DateTime Time { get; set; }
    }
}