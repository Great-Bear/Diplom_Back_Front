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
                    await _dbContext.AddAsync(new FavoriteAd { AdId = idAd, UserId = idUser });
                }
                else
                {
                    var adForRemove = _dbContext.Ads.FirstOrDefault(ad => ad.Id == idAd);
                    _dbContext.Ads.Remove( adForRemove );
                }
                await _dbContext.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                return Json(new { isError = true, message = ex.Message });
            }

            return Json(new { isError = false } ); 
        }
    }
}
