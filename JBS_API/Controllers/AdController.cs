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
           
                Ad newAd = new Ad { 
                                        Title = Title,
                                        Describe = Describe,
                                        User = userOwner,
                                        Category = category,
                                        Brend = brend,
                                        Price = price,
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

                return Json("Товар добавлен");           
              }
              catch (Exception ex)
              {
                  return Json("error server" + ex.Message );
              }
        }

        [HttpGet]
        [Route("MyAds")]
        public JsonResult TakeMyAds(int idUser)
        {
            try
            {
                var ads = _dbContext.Ads                                  
                                    .Where(a => a.UserId == idUser)
                                    .ToArray();

                return Json(ads);
            }
            catch (Exception ex)
            {
                return Json( "Ошибка сервера" );
            }
            
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
                ad.Describe = Describe;
                ad.Title = Title;
                ad.Price = Decimal.Parse(Price);
                ad.BrendId = idBrend;

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
        public JsonResult GetAdsPagination(int pagePagination )
        {
            pagePagination--;

            IQueryable<Ad> res;
            try
            {
                res = _dbContext.Ads.Skip(paginationStep * (pagePagination)).Take(paginationStep);
                return Json(new { data = res, count = res.Count() });
            }
            catch (Exception ex)
            {
                return Json( new { IsError = true, error = ex.Message } );
            }

            return Json(res);
        }
        [HttpGet]
        [Route("CountPaginPage")]
        public JsonResult CountPaginPage()
        {
            return Json( Math.Ceiling((float)_dbContext.Ads.Count() / paginationStep) );
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

            _dbContext.Ads.Remove(ad);
            _dbContext.SaveChanges();


            return Json(new { isError = false });
        }
    }
}
