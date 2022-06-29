using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using JBS_API.Response_Model;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace JBS_API.Controllers
{

    enum stateAd
    {
        noPublish = 1,
        cheking,
        publish,
        reject,
        deleted
    }
    
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class AdController : Controller
    {
        DbContext _dbContext;

        public AdController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpPost]
        [Route("create")]       
        public JsonResult Create(
            string Title,
            string Describe,
            int idUser,
            int Category,
            string Price,
            string Phone,
            bool IsDelivery,
            bool isNegotiatedPrice,
            string Quality,
            string TypeAd,
            int CurrencyId,
            string FiltersValue,
            IFormFile[] filecollect)  
        {
              try
              {        

                var userOwner = _dbContext.Users.FirstOrDefault(u => u.Id == idUser);

                if(userOwner == null)
                {
                    throw new Exception("error server User is null");
                }

                var category = _dbContext.Categories.FirstOrDefault(c => c.Id == Category);

                if(category == null)
                {
                    throw new Exception("error server Category is null");
                }


                decimal price;
                if( Decimal.TryParse(Price, out price) == false ){
                    throw new Exception("error server price is incorrent");
                }

                var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Проверяется");
                if(statusCheking == null)
                {
                    throw new Exception("error server" + "StatusCheking is null");
                }

                
                var QualityItem = _dbContext.QualityAds.FirstOrDefault(q => q.Name == Quality);

                if (QualityItem == null)
                {
                    throw new Exception("error server Quality is null");
                }

                var TypeAdItem = _dbContext.TypeOwners.FirstOrDefault(q => q.Name == TypeAd);
                if (TypeAdItem == null)
                {
                    throw new Exception("error server TypeAdItem is null");
                }

                Ad newAd = new Ad {
                    Title = Title,
                    Describe = Describe,
                    UserId = userOwner.Id,
                    Category = category,
                    BrendId = 1,
                    Price = price,
                    PhoneNumber = Phone,
                    isDelivery = IsDelivery,
                    QualityAdId = QualityItem.Id,
                    TypeOwnerId = TypeAdItem.Id,
                    isNegotiatedPrice = isNegotiatedPrice,
                    StatusAd = statusCheking,
                    CurrencyId = CurrencyId,
                };

                _dbContext.Ads.Add(newAd);
                _dbContext.SaveChanges();

                if (FiltersValue != null)
                {
                    string[] valueFilters;
                    if (FiltersValue.Length > 0)
                    {
                        valueFilters = FiltersValue.Split('|');

                        foreach (var filterId in valueFilters)
                        {

                            var lastAd = _dbContext.Ads.ToList().Last();

                            _dbContext.Filter_Ad.Add(new Filter_Ad
                            {
                                FilterValueId = int.Parse(filterId),
                                AdId = lastAd.Id
                            });
                            _dbContext.SaveChanges();
                        }
                    }
                }



                string uniqueName = String.Empty;
                if (filecollect.Length > 0)
                {
                    bool isMainImg = true;
                    foreach (var file in filecollect)
                    {
                        string extension = file.FileName.Substring(file.Name.LastIndexOf('.') + 1);

                        uniqueName = System.Guid.NewGuid().ToString() + extension;

                        string path = @".\Ads_Img\" + uniqueName;

                        using (var fileStream = new FileStream(path, FileMode.OpenOrCreate))
                        {
                            file.CopyTo(fileStream);
                        }

                        var lastAd = _dbContext.Ads.ToList().Last();
                        var newImg = new Img { Name = uniqueName, Ad = lastAd, IsMainImg = isMainImg };

                        if(isMainImg == true)
                        {
                            isMainImg = !isMainImg;
                        }

                        _dbContext.Imgs.Add(newImg);

                    }
                }

                _dbContext.SaveChanges();

                return Json( new
                {
                    idAd = newAd.Id,
                    isError = false
                } );           
              }
              catch (Exception ex)
              {
                  return Json( new
                  {
                      isError = true,
                      message = "Ошибка сервера",
                  } );
              }
            
        }

        [HttpGet]
        [Route("MyAds")]
        public JsonResult TakeMyAds(int idUser, int statusId)
        {

            try
            {
                var ads = _dbContext.Ads                                  
                                    .Where(a => a.UserId == idUser);

                var countPublish = ads.Where(a => a.StatusAdId == (int)stateAd.publish).Count();
                var countNoPublish = ads.Where(a => a.StatusAdId == (int)stateAd.noPublish).Count();
                var countReject = ads.Where(a => a.StatusAdId == (int)stateAd.reject).Count();
                var countCheking = ads.Where(a => a.StatusAdId == (int)stateAd.cheking).Count();

                var filterAds = ads.Where(a => a.StatusAdId == statusId).ToArray();

                int[] countsItem =
                    { 
                        countPublish,
                        countCheking,
                        countReject,
                        countNoPublish
                    };


                return Json( new
                {
                    ads = filterAds,
                    countsItem = countsItem
                });
            }
            catch (Exception ex)
            {
                return Json( "Ошибка сервера" );
            }
            
        }

        [HttpGet]
        [Route("GetWaitingAds")]
        public JsonResult GetWaitingAds()
        {
            return Json( new { 
                ads = _dbContext.Ads.Where(a => a.StatusAdId == (int)stateAd.cheking)
            });
        }

        [HttpPut]
        [Route("ChangeStatAd")]
        public JsonResult ChangeStatAd(int idAd, int newStat)
        {
            try
            {
                var ad = _dbContext.Ads.FirstOrDefault(a => a.Id == idAd);

                if(ad != null)
                {
                    ad.StatusAdId = newStat;
                    _dbContext.Ads.Update(ad);
                    _dbContext.SaveChanges();
                }
                else
                {
                    return Json(new
                    {
                        isError = true,
                        errorMessage = "Товар не найден"
                    });
                }
            }
            catch (Exception)
            {

                return Json(new
                {
                        isError = true,
                        errorMessage = "Ошибка сервера"
                });
            }
            return Json(new
            {
                isError = false,
                errorMessage = ""
            });
        }

        [HttpGet]
        [Route("GetOneAd")]
        public async Task<JsonResult> GetAd(int idAd)
        {
            try
            {
                var ad = _dbContext.Ads.FirstOrDefault(a => a.Id == idAd);
                var countImgs = _dbContext.Imgs.Count(i => i.AdId == idAd);


                _dbContext.Entry(ad).Collection("Filter_Ads").Load();
                int[] filters = new int[ad.Filter_Ads.Count()];

                for (int i = 0; i < ad.Filter_Ads.Count(); i++)
                {
                    filters[i] = ad.Filter_Ads.ElementAt(i).FilterValueId;
                }


                var resp = new Resp_One_Ad();

                if (ad == null)
                {
                    resp.Error = "Несуществующий товар";
                    resp.IsError = true;
                    return Json(resp);
                }

                await _dbContext.Entry(ad).Reference(ad => ad.QualityAd).LoadAsync();
                await _dbContext.Entry(ad).Reference(ad => ad.TypeOwner).LoadAsync();

                resp.Title = ad.Title;
                resp.Describe = ad.Describe;
                resp.Price = ad.Price.ToString();
                resp.CountImgs = countImgs;
                resp.idOwner = ad.UserId;
                resp.idCategory = ad.CategoryId;
                resp.idBrend = ad.BrendId;
                resp.phoneNumber = ad.PhoneNumber;
                resp.isNegotiatedPrice = ad.isNegotiatedPrice;
                resp.isDelivery = ad.isDelivery;
                resp.Filter_Ads = filters;
                resp.idCurrency = ad.CurrencyId;
                resp.Quality = ad.QualityAd.Name;
                resp.typeOwner = ad.TypeOwner.Name;
                resp.timeEnd = ad.TimeEnd;

                return Json(new
                {
                    isError = false,
                    data = resp
                }); ;
            }
            catch(Exception ex) 
            {
                return Json(new Error());
            }
        }
        [HttpPost]
        [Route("EditAd")]
        public JsonResult EditAd(int idAd,int idCurrency, string Title, string Describe,
            string Price, string Phone, bool IsDelivery, bool isNegotiatedPrice,
            string filtersValue,
            IFormFile[] filecollect)
        {
            try
            {
                var ad = _dbContext.Ads.FirstOrDefault(a => a.Id == idAd);

                var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Проверяется");

                ad.Describe = Describe;
                ad.Title = Title;
                ad.Price = Decimal.Parse(Price);
                ad.StatusAdId = statusCheking.Id;
                ad.PhoneNumber = Phone;
                ad.isDelivery = IsDelivery;
                ad.isNegotiatedPrice = isNegotiatedPrice;
                ad.CurrencyId = idCurrency;

                _dbContext.Entry(ad).Collection("Filter_Ads").Load();

                string[] valueFilters;
                if (filtersValue.Length > 0)
                {
                    valueFilters = filtersValue.Split('|');

                    for (int i = 0; i < valueFilters.Length; i++)
                    {
                        ad.Filter_Ads.ElementAt(i).FilterValueId = int.Parse(valueFilters[i]);
                    }
                }



                var imgs = _dbContext.Imgs.Where(i => i.AdId == idAd).ToArray();

                foreach (var img in imgs)
                {
                    FileInfo fileInf = new FileInfo(@".\Ads_Img\" + img.Name);
                    fileInf.Delete();
                    _dbContext.Imgs.Remove(img);
                }
                _dbContext.SaveChanges();



                if (filecollect.Length > 0)
                {
                    string uniqueName;
                    bool isMainImg = true;
                    foreach (var file in filecollect)
                    {
                        string extension = "";
                        if (file.ContentType.Contains('/'))
                        {
                            extension = file.ContentType.Substring(file.ContentType.LastIndexOf('/') + 1);

                        }
                        else
                        {
                            extension = file.FileName.Substring(file.Name.LastIndexOf('.') + 1);
                        }
                        uniqueName = System.Guid.NewGuid().ToString() + '.' + extension;

                        string path = @".\Ads_Img\" + uniqueName;
                        using (var fileStream = new FileStream(path, FileMode.OpenOrCreate))
                        {
                            file.CopyTo(fileStream);
                        }

                        var newImg = new Img { Name = uniqueName, Ad = ad, IsMainImg = isMainImg };
                        if (isMainImg == true)
                        {
                            isMainImg = !isMainImg;
                        }
                        _dbContext.Imgs.Add(newImg);

                    }
                }
                _dbContext.SaveChanges();
            }
            catch(Exception ex)
            {
                return Json(false);
            }

            return Json(true);
        }


        private int paginationStep = 16;
        [HttpGet]
        [Route("GetAdsPagination")]
        public async Task<JsonResult> GetAdsPagination(int pagePagination, int idCategory,int idBrend )
        {
            pagePagination--;
            int countItems = 0;
            var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

            IQueryable<Ad> res = null;
            try
            {
                if(idCategory != 0 && idBrend != 0)
                {
                    res = _dbContext.Ads.Where(a => a.CategoryId == idCategory 
                    && a.BrendId == idBrend);
                }
                else if(idCategory != 0)
                {
                    res = _dbContext.Ads.Where(a => a.CategoryId == idCategory);
                }
                else if(idBrend != 0)
                {
                    res = _dbContext.Ads.Where(a => a.BrendId == idBrend);
                }

                if(idCategory == 0 && idBrend == 0)
                {
                    res = _dbContext.Ads;
                }
                res = res.Where(a => a.StatusAdId == statusCheking.Id);
                countItems = res.Count();
                res = res.Skip(paginationStep * (pagePagination)).Take(paginationStep);

                await res.Include(f => f.QualityAd).LoadAsync();
                await res.Include(f => f.TypeOwner).LoadAsync();
                await res.Include(f => f.Currency).LoadAsync();


            }
            catch (Exception ex)
            {
                return Json( new { IsError = true, error = ex.Message } );
            }

            return Json( new { 
                data = res.OrderByDescending( r => r.TimeEnd ), 
                countPages = Math.Ceiling((float)countItems / paginationStep) ,
                isError = false,
            });
        }
        [HttpGet]
        [Route("PopularAds")]
        public async Task<JsonResult> PopularAds(int pagePagination)
        {
            try
            {
                var statusChecked = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

                pagePagination--;
                 var resList = _dbContext.Ads
                    .Where( ad => ad.StatusAdId == statusChecked.Id)
                    .OrderByDescending(a => a.FavoriteAds.Count)
                    .Skip(paginationStep * (pagePagination))
                    .Take(paginationStep);

                int countItems = resList.Count();

                await resList.Include(f => f.QualityAd).LoadAsync();
                await resList.Include(f => f.TypeOwner).LoadAsync();
                await resList.Include(f => f.Currency).LoadAsync();

                return Json(new 
                {
                    IsError = false,
                    data = resList,
                    countPages = Math.Ceiling((float)countItems / paginationStep)
                });
            }
            catch (Exception)
            {
                return Json(new Error
                {
                    IsError = true,
                    Message = "Ошибка сервера"
                } );
            }          
        }
        [HttpGet]
        [Route("RecommendedAds")]
        public async Task<JsonResult> RecommendedAds(int pagePagination, int idUser)
        {
            try
            {
                pagePagination--;
                var statusChecked = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");

                var FavOfUser = _dbContext.FavoriteAds
                    .Include( f => f.Ad)
                    .Where(u => u.UserId == idUser && u.Ad.StatusAd == statusChecked)
                    .ToList().GroupBy(a => a.Ad.CategoryId);

                
                var resList = new List<Ad>();

                foreach (var item in FavOfUser)
                {
                    var range = _dbContext.Ads
                        .Where(a => a.CategoryId == item
                        .First().Ad.CategoryId);

                    await range.Include(f => f.QualityAd).LoadAsync();
                    await range.Include(f => f.TypeOwner).LoadAsync();
                    await range.Include(f => f.Currency).LoadAsync();

                    resList.AddRange(range);
                }

                int countItems = resList.Count();
                resList = resList.Skip(paginationStep * (pagePagination)).Take(paginationStep).ToList();

              
                return Json(new 
                {
                    IsError = false,
                    data = resList.OrderByDescending(r => r.TimeEnd),
                    countPages = Math.Ceiling((float)countItems / paginationStep)
                });
            }
            catch (Exception)
            {

                return Json(new Error
                {
                    IsError = true,
                    Message = "Ошибка сервера"
                });
            }
        }

        [HttpPost]
        [Route("CheckListImg")]
        public JsonResult CheckListImg(IFormFile[] filecollect)  
        {
            
            string uniqueName;
            foreach (var file in filecollect)
            {
                string extension = file.ContentType.Substring(file.ContentType.LastIndexOf('/') + 1 );
                uniqueName = System.Guid.NewGuid().ToString() + '.' + extension;

                string path = @".\Ads_Img2\" + uniqueName ;
                using (var fileStream = new FileStream(path, FileMode.OpenOrCreate))
                {
                    file.CopyTo(fileStream);
                }
            }

            return Json(filecollect.Length);
        }
        [HttpDelete]
        [Route("DeleteAd")]
        public JsonResult DeleteAd(int idAd)
        {
            var ad = _dbContext.Ads.FirstOrDefault( a => a.Id == idAd );

            if(ad == null)
            {
                return Json(new { isError = true, Message = "Нет объекта на удаление" });
            }

            if(ad.StatusAdId == (int)stateAd.noPublish)
            {
                ad.StatusAdId = (int)stateAd.deleted;
            }
            else
            {
                ad.StatusAdId = (int)stateAd.noPublish;
            }
            _dbContext.Ads.Update(ad);
            _dbContext.SaveChanges();


            return Json(new { isError = false });
        }



    }
}
