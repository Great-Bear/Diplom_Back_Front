using JBS_API.DB_Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class FavoriteController : Controller
    {
        DbContext _dbContext;
        public FavoriteController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpPost]
        [Route("AddFovarite")]
        public async Task<JsonResult> AddFovarite(int idUser, int idAd, bool adToFavorite)
        {
            try 
            {
                if (adToFavorite)
                {
                    await _dbContext.FavoriteAds.AddAsync(new FavoriteAd { AdId = idAd, UserId = idUser });
                }
                else
                {
                    var adForRemove = _dbContext.FavoriteAds.FirstOrDefault(ad => ad.AdId == idAd && ad.UserId == idUser);
                    _dbContext.FavoriteAds.Remove( adForRemove );
                }
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, message = ex.Message });
            }

            return Json(new { isError = false } ); 
        }

        [HttpGet]
        [Route("GetFovarites")]
        public JsonResult GetFovarites(int idUser)
        {
            try
            {
                var resArray = _dbContext.FavoriteAds.Where(ad => ad.UserId == idUser);

                return Json(new { isError = false, arrFavorite = resArray });
             
            }
            catch (Exception ex)
            {
                return Json(new { isError = true, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("GetCountFovarites")]
        public JsonResult GetCountFovarites(int idUser)
        {
            try
            {
                var countFav = _dbContext.FavoriteAds.Where(ad => ad.UserId == idUser).GroupBy( ad => ad.Id ).Count();

                return Json(new { isError = false, count = countFav });

            }
            catch (Exception ex)
            {
                return Json(new { isError = true, message = ex.Message });
            }
        }

        [HttpGet]
        [Route("MyAdsFavorite")]
        public JsonResult MyAdsFavorite(int idUser)
        {

            try
            {
                var ads = _dbContext.Ads.Join(
                    _dbContext.FavoriteAds.Where( favAd => favAd.UserId == idUser ),
                    ad => ad.Id,
                    favAd => favAd.AdId,
                    (ad, favAd) => new
                    {
                        ad
                    }            
                    );


                return Json(new
                {
                    ads = ads,
                });
            }
            catch (Exception ex)
            {
                return Json("Ошибка сервера");
            }

        }

    }
}
