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
        public JsonResult Create(int idUser,string title, string describe, IFormFile uploadedFile)  //IFormFile uploadedFile,
        {        
              try
              {
                  if (uploadedFile != null)
                  {
                    string extension = uploadedFile.FileName.Substring(uploadedFile.Name.LastIndexOf('.') + 1);

                    string uniqueName = System.Guid.NewGuid().ToString() + extension;

                    string path = @".\Ads_Img\" + uniqueName;

                      using (var fileStream = new FileStream(path, FileMode.OpenOrCreate))
                      {
                        uploadedFile.CopyTo(fileStream);
                      }

                    var userOwner = _dbContext.Users.FirstOrDefault(u => u.Id == idUser);

                    if(userOwner == null)
                    {
                        return Json("error server"  + " Owner is null ");
                    }

                    Ad newAd = new Ad { 
                                        ImgName = uniqueName,
                                        Title = title,
                                        Describe = describe,
                                        User = userOwner };

                    _dbContext.Ads.Add(newAd);
                    _dbContext.SaveChanges();

                      return Json("File is saved");
                  }
                  else
                  {
                      return Json("file is empty" ) ;
                  }
              }
              catch (Exception ex)
              {
                  return Json("error server" + ex.Message );
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
