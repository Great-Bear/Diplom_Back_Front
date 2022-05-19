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

            return Json(arrayCat);
        }

        [HttpGet]
        [Route("LayersCategories")]
        public JsonResult LayersCategories()
        {

           var arrayCat = _dbContext.Layer1_Category.ToList()                  
                .GroupJoin(
                    _dbContext.Categories.ToList(),
                    layer1 => layer1.Id,
                    cat => cat.Layer1_CategoryId,
                        (layer1, cat) =>
                            new
                            {
                                layer1 = layer1.Name,
                                layer1Id = layer1.Id,
                                layer1T_idNextLayer = layer1.Layer2_CategoryId,
                                cat = cat.Select( item => item.Name ),
                                idCat = cat.Select(item => item.Id)

                            }
                    );

            var arrayCat2 = _dbContext.Layer2_Category.ToList()
          .GroupJoin(
                arrayCat,
                layer2 => layer2.Id,
                layer1 => layer1.layer1T_idNextLayer,
                (layer2, layer1) =>
                    new
                    {
                        layer2 = layer2.Name,
                        layer2Id = layer2.Id,
                        data = layer1
                    }
                );

            return Json(arrayCat2);
        }

        [HttpGet]
        [Route("StatusAd")]
        public JsonResult StatusAd()
        {
            var arraystatAds = _dbContext.StatusAds.ToArray();

            string[] namesState = new string[arraystatAds.Length];

            for (int i = 0; i < arraystatAds.Length; i++)
            {
                namesState[i] = arraystatAds[i].Name;
            }

            return Json(namesState);
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
                    Role roleModer = new Role { Name = "Moder" };

                    _dbContext.Roles.Add(role1);
                    _dbContext.Roles.Add(role2);
                    _dbContext.Roles.Add(roleModer);
                    _dbContext.SaveChanges();
                }


                if (_dbContext.Users.Count() == 0)
                {
                    Role roleUser = _dbContext.Roles.First(r => r.Name == "User");
                    Role roleModer = _dbContext.Roles.First(r => r.Name == "Moder");

                    User user1 = new User
                    {
                        FirstName = "Great",
                        LastName = "Bear",
                        Phone = "+43243423",
                        Email = "User1",
                        Password = "1234",
                        Role = roleUser
                    };

                    User userModer = new User
                    {
                        FirstName = "Moder1 name",
                        LastName = "Moder1 last name",
                        Phone = "+43243423",
                        Email = "Moder1",
                        Password = "1234",
                        Role = roleModer
                    };

                    _dbContext.Users.Add(user1);
                    _dbContext.Users.Add(userModer);
                    _dbContext.SaveChanges();

                }

                string[] StatusAd =
                {
                    "Опубликовано",
                    "Проверяется",
                    "Неактивно",
                    "Отклонено",
                    "Удалено",
                };

                if (_dbContext.StatusAds.Count() == 0)
                {
                    foreach (var status in StatusAd)
                    {
                        _dbContext.StatusAds.Add(new StatusAd { Name = status });
                    }
                    _dbContext.SaveChanges();
                }

                string[] Layer2_Category = {
                   "Група1",
                   "Група2",
                   "Група3",
                   "Група4",
                   "Група5",
                   "Група6",
                   "Група7",
                   "Група8",
               };

                if (_dbContext.Layer2_Category.Count() == 0)
                {
                    foreach (var category in Layer2_Category)
                    {
                        _dbContext.Layer2_Category.Add(new Layer2_Category { Name = category });
                        _dbContext.SaveChanges();
                    }
                }

                string[] Layer1_Category = {
                   "Подгрупа1",
                   "Подгрупа2",
                   "Подгрупа3",
                   "Подгрупа4",
                   "Подгрупа5",
                   "Подгрупа6",
                   "Подгрупа7",
                   "Подгрупа8",
               };

                var catLayer2 = _dbContext.Layer2_Category.FirstOrDefault(l => l.Name == "Група1");

                if (_dbContext.Layer1_Category.Count() == 0)
                {
                    foreach (var category in Layer1_Category)
                    {
                        _dbContext.Layer1_Category.Add(new Layer1_Category { Name = category, Layer2_Category = catLayer2 });
                        _dbContext.SaveChanges();
                    }
                }


                string[] Categories = {
                   "Ноутбуки и компьютеры",
                   "Смартфоны",
                   "Зоотовары",
                   "Категория 1",
                   "Категория 2",
                   "Категория 3",
                   "Категория 4",
                   "Категория 5",
                   "Категория 6",
                   "Категория 7",
               };

                var carLayer1 = _dbContext.Layer1_Category.FirstOrDefault(l => l.Name == "Подгрупа1");

                if (_dbContext.Categories.Count() == 0)
                {
                    foreach (var category in Categories)
                    {
                        _dbContext.Categories.Add(new Category { Name = category,Layer1_Category = carLayer1 });
                        _dbContext.SaveChanges();
                    }
                }

                CreateFilters();


                string[] Brends = {
                    "Samsung",
                    "Apple",
                    "Xiomi",
                    "Nike",
                    "Другое",
                };

                if (_dbContext.Brends.Count() == 0)
                {
                    foreach (var brend in Brends)
                    {
                        _dbContext.Brends.Add(new Brend { Name = brend });
                        _dbContext.SaveChanges();
                    }
                }
               

                var userOwner = _dbContext.Users.FirstOrDefault(u => u.FirstName == "Great");

                string[] files = Directory.GetFiles(@".\Imgs_Db_Fill\");
                string uniqueName = String.Empty;

                var random = new Random();

                var statusPublish = _dbContext.StatusAds.FirstOrDefault(s => s.Name == "Опубликовано");


                string[] qualityAd =
                {
                    "Новое",
                    "Б/У",
                };

                foreach (var item in qualityAd)
                {
                    _dbContext.QualityAds.Add(new QualityAd
                    {
                        Name = item
                    });
                    _dbContext.SaveChanges(); 
                }

                string[] typeOwners =
                {
                    "Бизнес",
                    "Частное",
                };

                foreach (var item in typeOwners)
                {
                    _dbContext.TypeOwners.Add(new TypeOwner { Name = item });
                    _dbContext.SaveChanges();
                }

                string[] currencies =
                {
                    "грн.",
                    "$",
                    "€",
                };

                if (_dbContext.Currencies.Count() == 0)
                {
                    foreach (var item in currencies)
                    {
                        _dbContext.Currencies.Add(new Currency { Name = item });
                        _dbContext.SaveChanges();
                    }
                }


                for (int i = 0; i < files.Length; i++)
                {
                    Ad newAd = new Ad
                    {
                        Title = $"Товар {i + 1}",
                        Describe = "Описание товара это Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут",
                        User = userOwner,
                        CategoryId = random.Next(1, Categories.Length ),
                        BrendId = random.Next(1, Brends.Length - 1),
                        QualityAdId = random.Next(1, 3),
                        TypeOwnerId = random.Next(1, 3),
                        isNegotiatedPrice = random.Next(0, 2) == 1 ? true : false,
                        isDelivery = random.Next(0, 2) == 1 ? true : false,
                        CurrencyId = random.Next(1, 4),
                        PhoneNumber = "+38(096)-350-38-33",
                        Price = random.Next(1, 10000),
                        StatusAd = statusPublish,
                    };


                    string extension = files[i].Substring(files[i].LastIndexOf('.'));
                    uniqueName = System.Guid.NewGuid().ToString() + extension;

                    string path = @".\Ads_Img\" + uniqueName;

                    FileInfo fileInf = new FileInfo(files[i]);
                    fileInf.CopyTo(path, true);

                    var newImg = new Img { Name = uniqueName, Ad = newAd, IsMainImg = true };
                    _dbContext.Imgs.Add(newImg);
                    _dbContext.SaveChanges();

                    int countAds = _dbContext.Ads.Count() - 1;
                    var lastAd = _dbContext.Ads.Skip(countAds).ToList().Last();

                    var filtersByCat = _dbContext.Filters.Where(f => f.CategoryId == lastAd.CategoryId).ToList();
                    
                    foreach (var filterItem in filtersByCat)
                    {
                        if (filterItem.CategoryId == lastAd.CategoryId)
                        {
                            var filtersValue = _dbContext.FilterValues.Where(f=> f.FilterId == filterItem.Id).ToList();
 

                            int lengthFiltersValue = filtersValue.Count();
                            _dbContext.Filter_Ad.Add(new Filter_Ad
                            {
                                FilterValueId = filtersValue.ElementAt(random.Next(0, lengthFiltersValue - 1)).Id,
                                AdId = lastAd.Id,
                            });
                            _dbContext.SaveChanges();
                        }
                        
                    }


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

        private void CreateFilters()
        {
            if(_dbContext.Filters.Count() > 0)
            {
                return;
            }
            var CatPhone = _dbContext.Categories.FirstOrDefault( c => c.Name == "Смартфоны");
            var CatPC = _dbContext.Categories.FirstOrDefault( c => c.Name == "Ноутбуки и компьютеры");
            var CatZoo = _dbContext.Categories.FirstOrDefault( c => c.Name == "Зоотовары");

            string[] typeFilters =
            {
                "slider",
                "items",
                "combo",
            };

            foreach (var typeFilter in typeFilters)
            {
               var a = _dbContext.TypeFilters.Add(new TypeFilter { Name = typeFilter });
                _dbContext.SaveChanges();
            }
            var FTypeSlider = _dbContext.TypeFilters.FirstOrDefault(f => f.Name == "slider");
            var FTypeItems = _dbContext.TypeFilters.FirstOrDefault(f => f.Name == "items");
            var FTypeCombo = _dbContext.TypeFilters.FirstOrDefault(f => f.Name == "combo");


            string[] FValueDiag =
            {                
                "4,1",
                "7,5",
                "5,6",
                "3",
                "2,1",
                "5,7"
            };

            _dbContext.Filters.Add(new Filter
            {
                FilterName = "Диагональ",
                Category = CatPhone,
                TypeFilter = FTypeCombo,
            });
            _dbContext.SaveChanges();

            var FilterDiagonal = _dbContext.Filters.ToList().Last();

            foreach (var item in FValueDiag)
            {
                _dbContext.FilterValues.Add(new FilterValue
                {
                    Name = item,
                    Filter = FilterDiagonal
                });
                _dbContext.SaveChanges();
            }
            
            string[] FValueBrend =
            {
                "Apple",
                "Samsung",
                "Nokia",
                "Motorola",
                "Xiomi",
                "BlackBerry"
            };

            _dbContext.Filters.Add(new Filter
            {
                FilterName = "Бренд",
                Category = CatPhone,
                TypeFilter = FTypeItems,
            });
            _dbContext.SaveChanges();

            var FilterBrendPhone = _dbContext.Filters.ToList().Last();

            foreach (var item in FValueBrend)
            {
                _dbContext.FilterValues.Add(new FilterValue
                {
                    Name = item,
                    Filter = FilterBrendPhone
                });
                _dbContext.SaveChanges();
            }


            string[] FValueBrendPC =
            {
                "Lenovo",
                "Apple",
                "HP",
                "ASUS",
                "Apple",
                "Mark2",
            };
            _dbContext.Filters.Add(new Filter
            {
                FilterName = "Бренд",
                Category = CatPC,
                TypeFilter = FTypeItems,
            });
            _dbContext.SaveChanges();

            var FilterBrendPC = _dbContext.Filters.ToList().Last();

            foreach (var item in FValueBrendPC)
            {
                _dbContext.FilterValues.Add(new FilterValue
                {
                    Name = item,
                    Filter = FilterBrendPC
                });
            }
            _dbContext.SaveChanges();


            string[] FValueCountCorePC =
            {
                "2",
                "4",
                "6",
                "12",
                "24",
                "99"
            };
            _dbContext.Filters.Add(new Filter
            {
                FilterName = "Количество ядер",
                Category = CatPC,
                TypeFilter = FTypeItems,
            });
            _dbContext.SaveChanges();

            var FilterCountCorePC = _dbContext.Filters.ToList().Last();

            foreach (var item in FValueCountCorePC)
            {
                _dbContext.FilterValues.Add(new FilterValue
                {
                    Name = item,
                    Filter = FilterCountCorePC
                });
            }

            _dbContext.SaveChanges();


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
