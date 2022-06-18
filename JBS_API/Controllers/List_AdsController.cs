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
            int priceFrom, int priceBefore,int idCurrency, string orderBy, string searchWord, FiltersValue[] filtersValue)
        {
            pagePagination--;
            paginationStep = stepPagin;
            int countItems = 0;
            var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

            IQueryable<Ad> res = _dbContext.Ads.Where(a => a.StatusAdId == statusCheking.Id);
            try
            {

                if (idCategory != 0)
                {
                    res = res.Where(a => a.CategoryId == idCategory);
                }

                if (searchWord != null )
                {
                    res = res.Where(a => a.Title.Contains(searchWord));
                }          

                if (idQuality != 0)
                {
                    res = res.Where(r => r.QualityAdId == idQuality);
                }

                if(idDel == true)
                {
                    res = res.Where(r => r.isDelivery == idDel);
                }

                if (idCurrency != 0)
                {
                    res = res.Where(r => r.CurrencyId == idCurrency);
                }

                if (priceBefore != -1)
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

                if (orderBy != null && res.Count() > 0)
                {
                    string[] orderByValues = orderBy.Split("|");

                    if (orderByValues.Length > 0)
                    {
                        if (orderByValues[0] != "0")
                        {
                            if (orderByValues[0] == "-1")
                            {
                                res = res.OrderByDescending(a => a.TimeEnd);
                            }
                            else
                            {
                                res = res.OrderBy(a => a.TimeEnd);
                            }
                        }
                        else if (orderByValues[1] != "0")
                        {
                            if (orderByValues[1] == "-1")
                            {
                                res = res.OrderBy(a => a.Price);
                            }
                            else
                            {
                                res = res.OrderByDescending(a => a.Price);
                            }
                        }
                        else if (orderByValues[2] != "0")
                        {
                            var resArr = res.ToArray();
                            var random = new Random();
                            for (int i = resArr.Length - 1; i >= 1; i--)
                            {
                                int j = random.Next(i + 1);
                                var temp = resArr[j];
                                resArr[j] = resArr[i];
                                resArr[i] = temp;
                            }
                            res = resArr.AsQueryable();
                        }
                    }
                }
           
                if (res.Count() > 0)
                {
                    foreach (var item in res.ToArray())
                    {
                        _dbContext.Entry(item).Reference("TypeOwner").Load();
                        _dbContext.Entry(item).Reference("QualityAd").Load();
                        _dbContext.Entry(item).Reference("Currency").Load();
                    }
                }
                countItems = res.Count();
                List<Ad> listRes = res.Skip(paginationStep * (pagePagination)).Take(paginationStep).ToList();

                decimal maxPrice = 0;
                decimal minPirce = 0;
                if(listRes.Count > 0)
                {
                    maxPrice = listRes.Max(f => f.Price);
                    minPirce = listRes.Min(f => f.Price);
                }


                return Json(new
                {
                    data = listRes,
                    priceMin = minPirce,
                    priceMax = maxPrice,
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
