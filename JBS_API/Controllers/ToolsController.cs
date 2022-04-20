using JBS_API.DB_Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.IO;
using System.Linq;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ToolsController : Controller
    {
        DbContext _dbContext;
        public ToolsController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("categories")]
        public JsonResult Categories()
        {
            var arrayCat = _dbContext.Categories.ToArray();

            string[] namesCat = new string[arrayCat.Length];

            for (int i = 0; i < arrayCat.Length; i++)
            {
                namesCat[i] = arrayCat[i].Name;
            }

            return Json(
                namesCat
                );
        }

        [HttpGet]
        [Route("brends")]
        public JsonResult Brends()
        {
            var arrayBran = _dbContext.Brends.ToArray();

            string[] namesbran = new string[arrayBran.Length];

            for (int i = 0; i < arrayBran.Length; i++)
            {
                namesbran[i] = arrayBran[i].Name;
            }

            return Json(
                namesbran
                );
        }

        [Route("PopulateDb")]
        [HttpPut]
        public string PopulateDb()
        {
            try
            {

                if (_dbContext.Roles.Count() == 0)
                {
                    Role role1 = new Role { Name = "Admin" };
                    Role role2 = new Role { Name = "User" };

                    _dbContext.Roles.Add(role1);
                    _dbContext.Roles.Add(role2);
                    _dbContext.SaveChanges();
                }


                if (_dbContext.Users.Count() == 0)
                {
                    Role role1 = _dbContext.Roles.First(r => r.Name == "Admin");

                    User user1 = new User
                    {
                        FirstName = "Great",
                        LastName = "Bear",
                        Phone = "+43243423",
                        Email = "Bogdan",
                        Password = "1234",
                        Role = role1
                    };

                    _dbContext.Users.Add(user1);
                    _dbContext.SaveChanges();

                }

                string[] Categories = {
               "Другое",
               "Ноутбуки и компьютеры",
               "Смартфоны, ТВ и эликтроника",
               "Бытовая техника",
               "Товары для дома",
               "Инструменты и автотовары",
               "Сантехника и ремонт",
               "Дача, сад и огород",
               "Спорт и увлечения",
               "Одежда, обувь и украшения",
               "Косметические товары",
               "Товары для детей",
               "Зоотовары",
               "Канцтовары и книги",
               "Алкогольные напитки",
               "Товары для бизнеса"
               };

                string[] Brends = {
                    "Другое",
                    "Samsung",
                    "Apple",
                    "Xiomi",
                    "Nike",
                };

                if (_dbContext.Categories.Count() == 0)
                {
                    foreach (var category in Categories)
                    {
                        _dbContext.Categories.Add(new Category { Name = category });
                    }
                }

                if (_dbContext.Brends.Count() == 0)
                {
                    foreach (var brend in Brends)
                    {
                        _dbContext.Brends.Add(new Brend { Name = brend });
                    }
                }
                _dbContext.SaveChanges();

                var userOwner = _dbContext.Users.FirstOrDefault(u => u.FirstName == "Great");

                string[] files = Directory.GetFiles(@".\Imgs_Db_Fill\");
                string uniqueName = String.Empty;

                var random = new Random();

                for (int i = 0; i < files.Length; i++)
                {
                    Ad newAd = new Ad
                    {
                        Title = $"Товар {i + 1}",
                        Describe = "Описание товара это Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут",
                        User = userOwner,
                        CategoryId = random.Next(1, Categories.Length - 1),
                        BrendId = random.Next(1, Brends.Length - 1),
                        Price = 1235,
                    };



                    string extension = files[i].Substring(files[i].LastIndexOf('.'));
                    uniqueName = System.Guid.NewGuid().ToString() + extension;

                    string path = @".\Ads_Img\" + uniqueName;

                    FileInfo fileInf = new FileInfo(files[i]);
                    fileInf.CopyTo(path, true);

                    var newImg = new Img { Name = uniqueName, Ad = newAd, IsMainImg = true };
                    _dbContext.Imgs.Add(newImg);
                    _dbContext.SaveChanges();


                    for (int j = 0; j < files.Length; j++)
                    {
                        if (j == i)
                        {
                            j++;
                        }
                        if (j == files.Length)
                        {
                            break;
                        }

                        extension = files[j].Substring(files[j].LastIndexOf('.'));
                        uniqueName = System.Guid.NewGuid().ToString() + extension;

                        path = @".\Ads_Img\" + uniqueName;

                        fileInf = new FileInfo(files[j]);
                        fileInf.CopyTo(path, true);

                        newImg = new Img { Name = uniqueName, Ad = newAd, IsMainImg = false };
                        _dbContext.Imgs.Add(newImg);
                        _dbContext.SaveChanges();

                    }
                }

                if (_dbContext.VipAds.Count() == 0)
                {
                    var ArrayAds = _dbContext.Ads.ToArray();
                    for (int i = 0; i < 10; i++)
                    {
                        var newVip = new VipAd();
                        newVip.Id = ArrayAds[i].Id;
                        newVip.countShows = 10;
                        _dbContext.VipAds.Add(newVip);
                        _dbContext.SaveChanges();
                    }
                }

            }
            catch(Exception ex)
            {
                return ex.Message;
            }

            return "true";

        }

        [Route("CleareDb")]
        [HttpDelete]
        public JsonResult ClearAPI()
        {
            _dbContext.RefreshDb();

            string[] files = Directory.GetFiles(@".\Ads_Img\");

            foreach (var file in files)
            {
                var fileInf = new FileInfo(file);
                fileInf.Delete();

            }
            return Json("Clear");
        }

    }
}
