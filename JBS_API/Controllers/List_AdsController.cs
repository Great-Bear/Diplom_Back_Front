using JBS_API.DB_Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace JBS_API.Controllers
{
    public class List_AdsController : Controller
    {

        DbContext _dbContext;
        public List_AdsController(DbContext db)
        {
            _dbContext = db;
        }

        private int paginationStep = 10;
        [HttpGet]
        [Route("GetAdsPagination")]
        public JsonResult GetAdsPagination(int pagePagination,int stepPagin, int idCategory)
        {
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
