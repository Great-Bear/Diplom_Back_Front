using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;
using JBS_API.Response_Model;

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
        public JsonResult Create(int idUser,string Title, string Describe,
            int Brend,
            int Category,
            string Price,
            IFormFile[] filecollect)  //IFormFile uploadedFile,
        {

            Brend += 1;
            Category += 1;

              try
              {
                    var userOwner = _dbContext.Users.FirstOrDefault(u => u.Id == idUser);

                    if(userOwner == null)
                    {
                        return Json("error server");
                    }

                   var category = _dbContext.Categories.FirstOrDefault(c => c.Id == Category);

                    if(category == null)
                    {
                        return Json("error server");
                    }

                    var brend = _dbContext.Brends.FirstOrDefault(b => b.Id == Brend);

                    if (brend == null)
                    {
                        return Json("error server");
                    }

                    decimal price;
                    if( Decimal.TryParse(Price, out price) == false ){
                        return Json("error server");
                    }
                var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Проверяется");

                if(statusCheking == null)
                {
                    return Json("error server" + "StatusCheking is null");
                }

                Ad newAd = new Ad { 
                                        Title = Title,
                                        Describe = Describe,
                                        User = userOwner,
                                        Category = category,
                                        Brend = brend,
                                        Price = price,
                                        StatusAd = statusCheking
                    };

                _dbContext.Ads.Add(newAd);
                _dbContext.SaveChanges();

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

                return Json(newAd.Id);           
              }
              catch (Exception ex)
              {
                  return Json("error server" + ex.Message );
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
        public JsonResult GetAd(int idAd)
        {
            var ad = _dbContext.Ads.FirstOrDefault(a => a.Id == idAd);
            var countImgs = _dbContext.Imgs.Count(i => i.AdId == idAd);

            var resp = new Resp_One_Ad();


            if (ad == null)
            {
                resp.Error = "Несуществующий товар";
                resp.IsError = true;
                return Json(resp);
            }
            
            resp.Title = ad.Title;
            resp.Describe = ad.Describe;
            resp.Price = ad.Price.ToString();
            resp.CountImgs = countImgs;
            resp.idOwner = ad.UserId;
            resp.idCategory = ad.CategoryId;
            resp.idBrend = ad.BrendId;
            
            return Json(resp);
        }
        [HttpPost]
        [Route("EditAd")]
        public JsonResult EditAd(int idAd, string Title, string Describe,
            string Price, int idBrend,
            IFormFile[] filecollect)
        {
            try
            {
                idBrend++;
                var ad = _dbContext.Ads.FirstOrDefault(a => a.Id == idAd);

                var statusCheking = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Проверяется");

                ad.Describe = Describe;
                ad.Title = Title;
                ad.Price = Decimal.Parse(Price);
                ad.BrendId = idBrend;
                ad.StatusAdId = statusCheking.Id;

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
        public JsonResult GetAdsPagination(int pagePagination, int idCategory,int idBrend )
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

            }
            catch (Exception ex)
            {
                return Json( new { IsError = true, error = ex.Message } );
            }

            return Json( new { 
                data = res, 
                countPages = Math.Ceiling((float)countItems / paginationStep) });
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
