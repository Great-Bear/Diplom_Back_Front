using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace JBS_Android.Resources.Models
{
    internal class Ad
    {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Describe { get; set; }
            public decimal Price { get; set; }

            public string PhoneNumber { get; set; }
            public bool isNegotiatedPrice { get; set; }
            public bool isDelivery { get; set; }

            public DateTime TimeEnd { get; set; } = DateTime.Now.AddMonths(1);
    }
}