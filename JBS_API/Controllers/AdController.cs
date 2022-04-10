using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

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


        [HttpPost]
        [Route("CheckListImg")]
        public JsonResult CheckListImg(IFormFile[] filecollect)  
        {
           return Json(filecollect.Length);
        }
    }
}
