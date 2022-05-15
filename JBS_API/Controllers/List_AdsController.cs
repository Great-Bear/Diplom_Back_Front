using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class List_AdsController : Controller
    {

        DbContext _dbContext;
        public List_AdsController(DbContext db)
        {
            _dbContext = db;
        }

        private int paginationStep = 10;
        [HttpPost]
        [Route("GetAdsPagination")]
        public JsonResult GetAdsPagination(int pagePagination,int stepPagin, int idCategory, int idQuality, bool idDel,
            int priceFrom, int priceBefore, FiltersValue[] filtersValue)
        {

            return Json(filtersValue);

            pagePagination--;
            paginationStep = stepPagin;
            int countItems = 0;
            var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

            IQueryable<Ad> res = null;
            try
            {
                if (idCategory == 0)
                {
                    res = _dbContext.Ads;
                }
                else if (idCategory != 0)
                {
                    res = _dbContext.Ads.Where(a => a.CategoryId == idCategory);
                }
                
                if(idQuality != 0)
                {
                    res = res.Where(r => r.QualityAdId == idQuality);
                }

                res = res.Where(r => r.isDelivery == idDel);

                if(priceBefore != priceFrom)
                {
                    res = res.Where(r => r.Price >= priceFrom && r.Price <= priceBefore);
                }

                res = res.Where(a => a.StatusAdId == statusCheking.Id);
                countItems = res.Count();
                var listRes = res.Skip(paginationStep * (pagePagination)).Take(paginationStep).ToList();


                foreach (var item in listRes)
                {
                    _dbContext.Entry(item).Reference("TypeOwner").Load();
                    _dbContext.Entry(item).Reference("QualityAd").Load();
                }
                return Json(new
                {
                    data = listRes,
                    priceMin =  _dbContext.Ads.Min(f => f.Price),
                    priceMax = _dbContext.Ads.Max( f => f.Price),
                    countPages = Math.Ceiling((float)countItems / paginationStep),
                    isError = false,
                });

            }
            catch (Exception ex)
            {
                return Json(new { IsError = true, error = ex.Message });
            }
        }
    }
}
