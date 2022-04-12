using JBS_API.DB_Models;
using JBS_API.Request_Model;
using JBS_API.Response_Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class UserController : ControllerBase
    {

        DbContext _dbContext;
        ILogger<Startup> logger;
        public UserController(DbContext db, ILogger<Startup> logger)
        {
            _dbContext = db;
            PopulateDb();
    }

        private void PopulateDb()
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
            var category2 = _dbContext.Categories.FirstOrDefault(c => c.Id == 1);
            var brend2 = _dbContext.Brends.FirstOrDefault(c => c.Id == 1);

            

            string[] files = Directory.GetFiles(@"C:\Users\38063\Desktop\Diplom_Back_Front\JBS_API\Imgs_Db_Fill\");
            string uniqueName = String.Empty;

            

            for (int i = 0; i < files.Length; i++)
            {
                Ad newAd = new Ad
                {
                    Title = $"Товар {i + 1}",
                    Describe = "Описание товара это Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут Описание товара будет тут",
                    User = userOwner,
                    Category = category2,
                    Brend = brend2,
                    Price = 1235,
                    TimeEnd = DateTime.Now.AddMonths(1)
                };
        
                for (int j = 0; j < files.Length; j++)
                {
                    bool isMainImg = false;

                    string extension = files[j].Substring(files[j].LastIndexOf('.'));
                    uniqueName = System.Guid.NewGuid().ToString() + extension;

                    string path = @".\Ads_Img\" + uniqueName;

                    FileInfo fileInf = new FileInfo(files[j]);
                    fileInf.CopyTo(path, true);

                    if(i == j)
                    {
                        isMainImg = true;
                    }

                    var newImg = new Img { Name = uniqueName, Ad = newAd, IsMainImg = isMainImg };
                    _dbContext.Imgs.Add(newImg);
                    _dbContext.SaveChanges();
                }
            }
            _dbContext.SaveChanges();

        }

        [Route("register")]
        [HttpPost]
        public async Task<JsonResult> Register(Regu_register requ_Register)
        {
            try
            {
                if (_dbContext.Users.FirstOrDefault
                    (u => u.Email == requ_Register.Login) != null)
                {
                    return new JsonResult(new Resp_Register { Error = "Такой логин уже занят" });
                }


                User newUser = new User
                {
                    Email = requ_Register.Login,
                    Password = requ_Register.Password,
                    Role = _dbContext.Roles.First(p => p.Name == "User")
                };

                _dbContext.Users.Add(newUser);
                var wasAdded = _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return new JsonResult(new Resp_Register { Error = "Ошибка сервера" });
            }


            var addedUser = _dbContext.Users.First(u => u.Email == requ_Register.Login);

            return new JsonResult(new Resp_Register { Id = addedUser.Id, Role = addedUser.Role.Name });
        }


        [Route("login")]
        [HttpPost]
        public async Task<JsonResult> Login(Regu_Login regu_Login)
        {
            try
            {
                var existingUser = _dbContext.Users.FirstOrDefault(u => u.Email == regu_Login.Login
                                                       && u.Password == regu_Login.Password);

                if (existingUser == null)
                {
                    return new JsonResult(new Resp_Login { Error = "Пользователь не найден" });
                }

                _dbContext.Entry(existingUser).Reference("Role").Load();

               
                return new JsonResult(new Resp_Login { Id = existingUser.Id, Role = existingUser.Role.Name });
            }
            catch(Exception ex)
            {
                return new JsonResult(new Resp_Login { Error = "Ошибка сервера" });
            }


        }

    }
}
