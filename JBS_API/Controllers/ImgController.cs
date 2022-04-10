using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Linq;

namespace JBS_API.Controllers
{
    public class ImgController : Controller
    {
        DbContext _dbContext;

        public ImgController(DbContext db)
        {
            _dbContext = db;
        }

       [HttpGet]
       [Route("GetMainImgAd")]
       public FileResult GetMainImgAd(int idAd)
       {

            var img = _dbContext.Imgs.FirstOrDefault(i => i.AdId == idAd 
                                                            && i.IsMainImg == true);

            string mainImgName = @".\Ads_Img\" + img.Name;

            foreach (var item in Directory.GetFiles(@".\Ads_Img\"))
            {
                if (item == mainImgName)
                {
                    int startCut = item.LastIndexOf('.') + 1;
                    string expansion = item.Substring(startCut, item.Length - startCut);
                    byte[] mas = System.IO.File.ReadAllBytes( item );
                    string file_type = $"application/{expansion}";
                    string file_name = $"img.{expansion}";
                    return File(mas, file_type, file_name);
                }
            }
            return null;
        }
    }
}
