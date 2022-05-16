using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
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

            pagePagination--;
            paginationStep = stepPagin;
            int countItems = 0;
            var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

            IQueryable<Ad> res = _dbContext.Ads;
            try
            {
                res = res.Where(a => a.StatusAdId == statusCheking.Id);

                if (idCategory == 0)
                {
                    res = _dbContext.Ads;
                }
                else if (idCategory != 0)
                {
                    res = _dbContext.Ads.Where(a => a.CategoryId == idCategory);
                }

                if (idQuality != 0)
                {
                    res = res.Where(r => r.QualityAdId == idQuality);
                }

                res = res.Where(r => r.isDelivery == idDel);

                if (priceBefore != priceFrom)
                {
                    res = res.Where(r => r.Price >= priceFrom && r.Price <= priceBefore);
                }


                List<Ad> finalListAd = new List<Ad>();

                int index = 0;
                foreach (var itemFV in filtersValue)
                {
                    if (itemFV.IdFilter > 0)
                    { 
                        List<FilterValue> filtersByRange = new List<FilterValue>();
                    List<Ad> resFilters = new List<Ad>();
                    IQueryable<FilterValue> FiltesValueById =
                        _dbContext.FilterValues.Where(f => f.FilterId == itemFV.IdFilter); ;



                    if (itemFV.UserSlider == true)
                    {
                        if (itemFV.MaxValue != "" && itemFV.MinValue != "")
                        {

                            float minF = float.Parse(itemFV.MinValue);
                            float maxF = float.Parse(itemFV.MaxValue);

                            foreach (var filterItem in FiltesValueById.ToList())
                            {
                                float valF = float.Parse(filterItem.Name);
                                if (valF >= minF && valF <= maxF)
                                {
                                    filtersByRange.Add(filterItem);
                                }
                            }
                        }
                    }
                    else
                    {
                        if (itemFV.Values.Length != 0)
                        {
                            foreach (var filterItem in FiltesValueById.ToList())
                            {
                                foreach (var item in itemFV.Values)
                                {
                                    if (filterItem.Id == int.Parse(item))
                                    {
                                        filtersByRange.Add(filterItem);
                                    }
                                }
                            }
                        }
                    }                      
                    if (filtersByRange.Count() != 0)
                    {
                        var filtValueID_AdID = _dbContext.Filter_Ad.ToList().Join(
                             filtersByRange,
                             fil_Ad => fil_Ad.FilterValueId,
                             filByRange => filByRange.Id,
                             (fil_Ad, filByRange) =>
                             new
                             {
                                 fil_AFId = fil_Ad.FilterValueId,
                                 fil_ADId = fil_Ad.AdId
                             }
                             );
                            

                        var Filter_AdBySort = filtValueID_AdID.Join(
                            res,
                             FA_id => FA_id.fil_ADId,
                            ad => ad.Id,
                            (FA_id, ad) => new
                            {
                                ad = ad
                            }
                            );

                      foreach (var item in Filter_AdBySort.ToList())
                            {

                            if (finalListAd.Contains(item.ad) == false)
                            {
                                finalListAd.Add(item.ad);
                            }
                      }
                        index++;
                    }
                }
            }
               
                if (index != 0 )
                {
                    res = finalListAd.AsQueryable();
                }

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
