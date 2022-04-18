using JBS_API.DB_Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class VipAdController : Controller
    {
        DbContext _dbContext;

        public VipAdController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("GetVipAds")]
        public JsonResult GetVipAds()
        {
            var vipAds = _dbContext.VipAds.Skip(4).Take(4).ToArray();
            var ads = new Ad[4];
            for (int i = 0; i < ads.Length; i++)
            {
                Ad ad = new Ad();
                ads[i] = _dbContext.Ads.FirstOrDefault( a => a.Id == vipAds[i].Id );

            }

            return Json(ads);
        }
    }
}
