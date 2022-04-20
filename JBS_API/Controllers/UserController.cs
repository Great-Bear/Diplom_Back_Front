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


        [Route("reg")]
        [HttpPost]
        public JsonResult reg(Regu_register data)
        {
            try
            {
                return new JsonResult(new { q = data, db = _dbContext.Ads.Count() });
            }
            catch (Exception ex)
            {

            }
            return new JsonResult(new { q = data });
        }


    }
}
