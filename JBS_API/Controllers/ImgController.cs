using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
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
            string mainImgName;

            if (img != null)
            {
                mainImgName = @".\Ads_Img\" + img.Name;
               
            }
            else
            {
                mainImgName = @".\Ads_Img\" + "emptyImg.png";
            }

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

        [HttpGet]
        [Route("GetImgsOfAd")]
        public FileResult GetImgOfAd(int idAd, int numeberImg)
        {
            try
            {          
                var imgsAd = _dbContext.Imgs.Where(i => i.AdId == idAd ).ToArray();
                
                for (int i = 0; i < imgsAd.Length; i++)
                {
                    if(i == numeberImg)
                    {
                        int startCut = imgsAd[i].Name.LastIndexOf('.') + 1;
                        string expansion = imgsAd[i].Name.Substring(startCut, imgsAd[i].Name.Length - startCut);
                        byte[] mas = System.IO.File.ReadAllBytes(@".\Ads_Img\" + imgsAd[i].Name);
                        string file_type = $"application/{expansion}";
                        string file_name = $"img.{expansion}";
                        return File(mas, file_type, file_name);
                    }                  
                }                                          
            }
            catch (Exception ex)
            {
                return null;
            }

            return null;
        }

    }
}
